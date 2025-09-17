"use client";
import { useState } from "react";
import Input from "../../../../../components/ui/input";
import { Card } from "../../../../../components/ui/card";
import { Button } from "../../../../../components/ui/button";
import WorkerCard from "../../../../../components/ui/worker-card";

export default function CustomerSearch() {
  const [view, setView] = useState<'list'|'map'>('list');
  const [rating, setRating] = useState(0);
  const [avail, setAvail] = useState<'any'|'today'|'now'>('any');
  const tags = ['Plumber','Electrician','Cook','Painter','Carpenter','Cleaner'];
  return (
    <section className="space-y-10">
      <header className="space-y-1 flex flex-col sm:flex-row sm:items-end gap-2 sm:justify-between">
        <div>
          <h2 className="text-[28px] font-semibold tracking-tight">Search workers</h2>
          <p className="text-[13px] text-[var(--apple-text-secondary)]">Find skilled professionals near you</p>
        </div>
        <div className="segmented" aria-label="Result view toggle">
          <button type="button" data-active={view==='list'} onClick={()=>setView('list')}>List</button>
          <button type="button" data-active={view==='map'} onClick={()=>setView('map')}>Map</button>
          <span className="segmented-indicator" />
        </div>
      </header>
      <Card variant="soft" className="p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-3">
          <Input placeholder="Search by skill (e.g., Plumber)" className="flex-1" />
          <div className="flex gap-2">
            <Button>Search</Button>
            <Button variant="secondary">Reset</Button>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap text-[11px]">
          {tags.map(tag => (
            <button key={tag} className="px-3 h-8 rounded-full bg-[var(--apple-bg-alt)] text-[var(--apple-text-secondary)] hover:text-[var(--apple-text)] hover:bg-white border border-[var(--apple-border)] text-[11px] font-medium transition-base">
              {tag}
            </button>
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">Minimum rating</p>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(r => (
                <button key={r} onClick={()=>setRating(r)} className={`w-10 h-10 rounded-2xl border text-[14px] font-semibold ${rating>=r ? 'bg-[var(--apple-accent)] text-white border-[var(--apple-accent)]' : 'border-[var(--apple-border)] text-[var(--apple-text-secondary)] hover:text-[var(--apple-text)] hover:border-[var(--apple-border-strong)]'}`}>★{r}</button>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">Availability</p>
            <div className="segmented" aria-label="Availability filter">
              <button type="button" data-active={avail==='any'} onClick={()=>setAvail('any')}>Any</button>
              <button type="button" data-active={avail==='today'} onClick={()=>setAvail('today')}>Today</button>
              <button type="button" data-active={avail==='now'} onClick={()=>setAvail('now')}>Now</button>
              <span className="segmented-indicator" />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">Location radius (km)</p>
            <input type="range" min={1} max={25} defaultValue={5} className="w-full" />
            <p className="text-[11px] text-[var(--apple-text-secondary)]">Approx. 5 km radius</p>
          </div>
        </div>
      </Card>

      {view==='list' && (
        <div className="grid gap-5">
          <WorkerCard name="Ravi Singh" skill="Carpenter" />
          <WorkerCard name="Neha Joshi" skill="Cook" />
          <WorkerCard name="Imran Khan" skill="Painter" />
          <WorkerCard name="Tina Verma" skill="Cleaner" />
        </div>
      )}
      {view==='map' && (
        <Card variant="soft" className="p-0 overflow-hidden h-[480px] flex items-center justify-center text-[13px] text-[var(--apple-text-secondary)]">
          <div className="w-full h-full bg-[linear-gradient(120deg,#eef1f5,#f8f9fb)] relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center space-y-3">
                <p className="font-medium text-[var(--apple-text)]">Map placeholder</p>
                <p>Map / markers UI will appear here.</p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </section>
  );
}
