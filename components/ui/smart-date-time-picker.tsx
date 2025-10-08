"use client"

import React from "react"
import { parseDate } from "chrono-node"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

/**
 * A simplified, self-contained smart datetime input inspired by the code you provided.
 * - Supports natural language input via chrono-node
 * - Exposes value as a Date via onValueChange
 * - Shows a small panel with a native date input and a time-picker list
 */

export type SmartDatetimeInputProps = {
  value?: Date
  onValueChange: (date: Date) => void
  placeholder?: string
  disabled?: boolean
}

const DEFAULT_SIZE = 96

const formatDateTime = (datetime: Date | string) => {
  try {
    return new Date(datetime).toLocaleTimeString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  } catch (e) {
    return ""
  }
}

const parseDateTime = (str: Date | string) => {
  if (str instanceof Date) return str
  return parseDate(String(str))
}

export default function SmartDateTimePicker({ value, onChange, className, required, id, name }: any) {
  // props are flexible because callers expect (id,name,value,onChange,...) signature
  const val: Date | undefined = value instanceof Date ? value : undefined
  const onValueChange: (d: Date) => void = (onChange as any) || ((d: Date) => {})

  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState<string>(val ? formatDateTime(val) : "")
  const [selected, setSelected] = React.useState<Date | undefined>(val)

  React.useEffect(() => {
    if (value instanceof Date) {
      setSelected(value)
      setInputValue(formatDateTime(value))
    }
  }, [value])

  const handleParse = React.useCallback((raw: string) => {
    const parsed = parseDateTime(raw)
    if (parsed) {
      setSelected(parsed)
      setInputValue(formatDateTime(parsed))
      onValueChange(parsed)
    }
  }, [])

  // Time picker: generate 24*4 = 96 entries at 15-minute steps
  const timeList = React.useMemo(() => {
    const list: string[] = []
    for (let h = 0; h < 24; h++) {
      for (let p = 0; p < 4; p++) {
        const m = p * 15
        const date = new Date()
        date.setHours(h, m, 0, 0)
        list.push(format(date, "hh:mm a"))
      }
    }
    return list
  }, [])

  // filter times to avoid past times when date is today (caller expects no past selections)
  const filteredTimeList = React.useMemo(() => {
    if (!selected) return timeList
    const now = new Date()
    const selDate = new Date(selected)
    const sameDay = selDate.getFullYear() === now.getFullYear() && selDate.getMonth() === now.getMonth() && selDate.getDate() === now.getDate()
    if (!sameDay) return timeList
    // only include times strictly after now
    return timeList.filter((t) => {
      const p = parseDateTime(t)
      if (!p) return false
      const candidate = new Date(selDate)
      candidate.setHours(p.getHours(), p.getMinutes(), 0, 0)
      return candidate.getTime() > now.getTime()
    })
  }, [selected, timeList])

  const applyDate = (d?: Date) => {
    if (!d) return
    const next = new Date(d)
    if (selected) {
      next.setHours(selected.getHours(), selected.getMinutes())
    }
    setSelected(next)
    onValueChange(next)
    setInputValue(formatDateTime(next))
  }

  const applyTime = (timeStr: string) => {
    const now = selected ? new Date(selected) : new Date()
    const parsed = parseDateTime(timeStr)
    if (!parsed) return
    now.setHours(parsed.getHours(), parsed.getMinutes())
    setSelected(now)
    onValueChange(now)
    setInputValue(formatDateTime(now))
  }

  return (
    <div className={cn("w-full relative", className)}>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          placeholder={"e.g. tomorrow at 5pm"}
          onChange={(e) => setInputValue(e.currentTarget.value)}
          onBlur={(e) => handleParse(e.currentTarget.value)}
        />
        <button type="button" onClick={() => setOpen((s) => !s)} className={buttonVariants({ variant: 'outline', size: 'icon' }) as any}>
          <CalendarIcon className="size-4" />
        </button>
      </div>

      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-md border bg-white shadow-lg p-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-slate-600 mb-1 block">Date</label>
              <input type="date" className="rounded-md border px-3 py-2 w-full" min={new Date().toISOString().slice(0,10)} onChange={(e) => applyDate(e.target.value ? new Date(e.target.value) : undefined)} />
            </div>

            <div>
              <label className="text-sm text-slate-600 mb-1 block">Time</label>
              <div className="h-48 overflow-auto border rounded-md">
                <ul className="p-2">
                  {filteredTimeList.map((t, i) => (
                    <li key={i} className="py-1">
                      <button type="button" onClick={() => applyTime(t)} className="text-sm w-full text-left px-2 py-1 hover:bg-slate-100 rounded">{t}</button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden input for form submission */}
      <input type="hidden" id={id} name={name} value={selected ? selected.toISOString() : ""} readOnly />
    </div>
  )
}
