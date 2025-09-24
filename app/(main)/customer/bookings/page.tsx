"use client";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Booking = { id:number; title:string; worker:string; when:string; status:'Pending'|'Confirmed'|'Completed'|'Cancelled'; price?:number; notes?:string };

const initial: Booking[] = [
  { id: 1, title: "Plumbing fix", worker: "Priya Patil", when: "Today 5:00 PM", status: "Confirmed", price:550, notes:'Replace pipe joint' },
  { id: 2, title: "Fan installation", worker: "Amit Kumar", when: "Tomorrow 11:00 AM", status: "Pending", price:400 },
  { id: 3, title: "Deep cleaning", worker: "Suresh Yadav", when: "25 Aug 9:00 AM", status: "Pending", price:1200 },
  { id: 4, title: "Switch repair", worker: "Ravi Singh", when: "Yesterday 3:30 PM", status: "Completed", price:250, notes:'Loose wire fixed' },
];

export default function Bookings() {
  const [filter, setFilter] = useState<'All'|'Pending'|'Confirmed'|'Completed'>('All');
  const [selected, setSelected] = useState<Booking|null>(null);
  const list = initial.filter(b => filter==='All' || b.status===filter);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="space-y-10">
        <header className="flex flex-col sm:flex-row sm:items-end gap-4 sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-[28px] font-semibold tracking-tight">Bookings</h2>
            <p className="text-[13px] text-[var(--apple-text-secondary)]">Manage your service requests</p>
          </div>
          <div className="segmented" aria-label="Filter status">
            {['All','Pending','Confirmed','Completed'].map(f => (
              <button key={f} type="button" data-active={filter===f} onClick={()=>setFilter(f as any)}>{f}</button>
            ))}
            <span className="segmented-indicator" />
          </div>
        </header>

        <div className="grid gap-5">
          {list.map(b => (
            <Card key={b.id} variant="soft" className="p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-white/60 cursor-pointer" onClick={()=>setSelected(b)}>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] font-medium text-[var(--apple-text)]">{b.title}</p>
                <p className="text-[11px] mt-1 text-[var(--apple-text-secondary)]">{b.worker} • {b.when}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${b.status==='Pending' ? 'bg-amber-100 text-amber-700' : b.status==='Confirmed' ? 'bg-blue-100 text-blue-700' : b.status==='Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{b.status}</span>
                <Button variant="ghost" className="!h-8 px-3">Details</Button>
              </div>
            </Card>
          ))}
          {list.length===0 && <p className="text-[12px] text-center text-[var(--apple-text-secondary)] py-10">No bookings for this filter.</p>}
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={()=>setSelected(null)} />
            <Card variant="soft" className="relative w-full sm:w-[520px] max-h-[90vh] overflow-y-auto p-8 space-y-6 rounded-t-3xl sm:rounded-3xl">
              <div className="flex items-start justify-between">
                <h3 className="text-[20px] font-semibold tracking-tight">Booking details</h3>
                <button onClick={()=>setSelected(null)} className="w-9 h-9 rounded-xl bg-[var(--apple-bg-alt)] border border-[var(--apple-border)] flex items-center justify-center text-[var(--apple-text-secondary)] hover:text-[var(--apple-text)]">✕</button>
              </div>
              <div className="space-y-4">
                <div><p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">Service</p><p className="text-[14px] font-medium mt-1">{selected.title}</p></div>
                <div><p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">Worker</p><p className="text-[14px] font-medium mt-1">{selected.worker}</p></div>
                <div><p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">Scheduled</p><p className="text-[14px] font-medium mt-1">{selected.when}</p></div>
                <div><p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">Status</p><span className={`inline-block text-[11px] px-2 py-1 rounded-full font-medium mt-1 ${selected.status==='Pending' ? 'bg-amber-100 text-amber-700' : selected.status==='Confirmed' ? 'bg-blue-100 text-blue-700' : selected.status==='Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{selected.status}</span></div>
                {selected.price && <div><p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">Price</p><p className="text-[14px] font-medium mt-1">₹{selected.price}</p></div>}
                {selected.notes && <div><p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">Notes</p><p className="text-[14px] mt-1">{selected.notes}</p></div>}
              </div>
              <div className="flex gap-3">
                {selected.status === 'Pending' && <Button className="flex-1">Confirm</Button>}
                {selected.status === 'Confirmed' && <Button className="flex-1">Mark Complete</Button>}
                <Button variant="secondary" className="flex-1">Contact Worker</Button>
              </div>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}
