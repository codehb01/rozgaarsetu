"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import type { GeocodeResult } from "@/lib/location"

type Props = {
  value?: string
  onChange?: (value: string) => void
  onSelect?: (result: GeocodeResult) => void
  placeholder?: string
  className?: string // wrapper
  inputClassName?: string // forwarded to Input for consistent UI
}

export function OpenStreetMapInput({ value, onChange, onSelect, placeholder = "Search location", className, inputClassName }: Props) {
  const [query, setQuery] = React.useState(value ?? "")
  const [results, setResults] = React.useState<GeocodeResult[]>([])
  const [loading, setLoading] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [activeIndex, setActiveIndex] = React.useState<number>(-1)
  const abortRef = React.useRef<AbortController | null>(null)

  React.useEffect(() => setQuery(value ?? ""), [value])

  React.useEffect(() => {
    if (!query || query.length < 3) {
      setResults([])
      setOpen(false)
      return
    }
    const t = setTimeout(async () => {
      try {
        setLoading(true)
        abortRef.current?.abort()
        const ac = new AbortController()
        abortRef.current = ac
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`, { signal: ac.signal })
        if (!res.ok) throw new Error("geocode failed")
        const data = await res.json()
        setResults(data.results ?? [])
        setOpen(true)
      } catch (e) {
        // swallow
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  return (
    <div className={cn("relative", className)}>
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          onChange?.(e.target.value)
        }}
        placeholder={placeholder}
        onFocus={() => results.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className={inputClassName}
        role="combobox"
        aria-expanded={open}
        aria-autocomplete="list"
        aria-controls="osm-options"
        onKeyDown={(e) => {
          if (!open) return
          if (e.key === "ArrowDown") {
            e.preventDefault()
            setActiveIndex((i) => Math.min(i + 1, results.length - 1))
          } else if (e.key === "ArrowUp") {
            e.preventDefault()
            setActiveIndex((i) => Math.max(i - 1, 0))
          } else if (e.key === "Enter") {
            e.preventDefault()
            const sel = results[activeIndex]
            if (sel) {
              onSelect?.(sel)
              setQuery(sel.displayName)
              setOpen(false)
            }
          } else if (e.key === "Escape") {
            setOpen(false)
          }
        }}
      />
      {open && (
        <div className="absolute z-20 mt-2 w-full rounded-md border bg-popover text-popover-foreground shadow-sm">
          <ul id="osm-options" role="listbox" className="max-h-64 overflow-auto p-2">
            {loading && (
              <li className="px-2 py-1.5 text-sm text-muted-foreground">Searching…</li>
            )}
            {!loading && results.length === 0 && (
              <li className="px-2 py-1.5 text-sm text-muted-foreground">No results</li>
            )}
            {results.map((r, idx) => (
              <li
                key={`${r.coords.lat},${r.coords.lng}-${r.displayName}`}
                role="option"
                aria-selected={idx === activeIndex}
                className={cn(
                  "cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
                  idx === activeIndex && "bg-accent text-accent-foreground"
                )}
                onMouseDown={(e) => {
                  e.preventDefault()
                  onSelect?.(r)
                  setQuery(r.displayName)
                  setOpen(false)
                }}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {r.displayName}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default OpenStreetMapInput
