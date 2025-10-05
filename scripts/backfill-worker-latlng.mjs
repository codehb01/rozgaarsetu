import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
// light-weight geocode helper (same logic as lib/geocoding but self-contained for this script)
const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org'
const OSM_USER_AGENT = process.env.NOMINATIM_USER_AGENT || 'RozgaarSetu/1.0 (contact: support@rozgaarsetu.local)'
const APP_REFERER = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

let _lastSearchAt = 0
async function throttleSearch(){
  const now = Date.now(); const elapsed = now - _lastSearchAt; const wait = elapsed >= 1000 ? 0 : 1000 - elapsed
  if(wait>0) await new Promise(r=>setTimeout(r, wait))
  _lastSearchAt = Date.now()
}

async function geocodeFreeOSM(query){
  if(!query?.trim()) return []
  await throttleSearch()
  const url = new URL(NOMINATIM_BASE + '/search')
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'jsonv2')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '3')
  const res = await fetch(url.toString(), { headers: { 'User-Agent': OSM_USER_AGENT, 'Referer': APP_REFERER, 'Accept': 'application/json' } })
  if(!res.ok) return []
  const data = await res.json()
  return (data || []).map(d=>({ lat: parseFloat(d.lat), lon: parseFloat(d.lon), display_name: d.display_name }))
}

const prisma = new PrismaClient()

async function sleep(ms){ return new Promise(r=>setTimeout(r,ms)) }

async function main(){
  console.log('Starting backfill: find WorkerProfile rows with null lat/lng')
  const LIMIT = parseInt(process.env.BACKFILL_LIMIT || '200', 10)
  const profiles = await prisma.workerProfile.findMany({ where: { OR: [{ latitude: null }, { longitude: null }] }, take: LIMIT })
  console.log(`Found ${profiles.length} profiles to inspect`)
  let updated = 0
  for(const p of profiles){
    try{
      // Prepare candidate address forms to try progressively
      const candidates = []
      const full = [p.address, p.city, p.state, p.country, p.postalCode].filter(Boolean).join(', ')
      if(full) candidates.push({ label: 'full', q: full })
      if(p.postalCode && p.city) candidates.push({ label: 'postal+city', q: [p.postalCode, p.city, p.state, p.country].filter(Boolean).join(', ') })
      if(p.city) candidates.push({ label: 'city', q: [p.city, p.state, p.country].filter(Boolean).join(', ') })
      // try availableAreas as smaller local hints
      if(Array.isArray(p.availableAreas) && p.availableAreas.length){
        for(const area of p.availableAreas.slice(0,3)){
          candidates.push({ label: `area:${area}`, q: [area, p.city, p.state, p.country].filter(Boolean).join(', ') })
        }
      }

      if(candidates.length === 0){
        console.log('\nSkipping (no address data):', p.id)
        continue
      }

      let found = null
      console.log(`\nGeocoding for: ${p.id} (trying ${candidates.length} candidate forms)`)
      for(const c of candidates){
        console.log('  -> trying', c.label, '-', c.q)
        const results = await geocodeFreeOSM(c.q)
        if(results && results.length){
          const best = results[0]
          const lat = best.lat ?? best.coords?.lat ?? null
          const lng = best.lon ?? best.coords?.lng ?? best.coords?.lon ?? null
          if(lat && lng){
            found = { lat: Number(lat), lng: Number(lng), method: c.label }
            console.log('    -> hit:', found.lat, found.lng, `method=${c.label}`)
            break
          }
        }
        console.log('    -> no results for', c.label)
        // be polite between candidate tries as well
        await sleep(1100)
      }

      if(found){
        await prisma.workerProfile.update({ where: { id: p.id }, data: { latitude: found.lat, longitude: found.lng } })
        console.log('Updated', p.id, found.lat, found.lng, 'via', found.method)
        updated++
      } else {
        console.log('No geocode result for', p.id)
      }
    }catch(e){
      console.error('Error for', p.id, e)
    }
    // Be polite to Nominatim (1 request per second)
    await sleep(1100)
  }
  console.log('\nBackfill complete. Updated', updated, 'profiles')
  await prisma.$disconnect()
}

main().catch(async (e)=>{ console.error(e); await prisma.$disconnect(); process.exit(1) })
