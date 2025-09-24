"use client";
import { useState } from "react";
import Input from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ReviewsPage() {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [worker, setWorker] = useState('');
  const [job, setJob] = useState('');
  
  const recent = [
    { id:1, worker:'Sunil Rao', job:'Pipe repair', rating:5, comment:'Quick and professional. Fixed the leak within an hour and cleaned up everything.', date: '2024-01-15'},
    { id:2, worker:'Imran Khan', job:'Wall painting', rating:4, comment:'Good finish. Very neat work and completed on time.', date: '2024-01-10'},
    { id:3, worker:'Priya Patil', job:'AC maintenance', rating:5, comment:'Excellent service. Explained everything clearly and gave maintenance tips.', date: '2024-01-08'},
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating && comment && worker && job) {
      // Add review logic here
      setOpen(false);
      setRating(0);
      setComment('');
      setWorker('');
      setJob('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="space-y-10">
        <header className="space-y-1 flex flex-col sm:flex-row sm:items-end gap-2 sm:justify-between">
          <div>
            <h2 className="text-[28px] font-semibold tracking-tight">Reviews</h2>
            <p className="text-[13px] text-[var(--apple-text-secondary)]">Submit and view feedback</p>
          </div>
          <Button onClick={()=>setOpen(true)}>New review</Button>
        </header>
        
        <div className="grid gap-5 md:grid-cols-2">
          {recent.map(r => (
            <Card key={r.id} variant="soft" className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium">{r.worker}</p>
                <div className="flex gap-0.5 text-[var(--apple-accent)] text-[12px]">
                  {Array.from({length:5}).map((_,i)=>(<span key={i} className={i>=r.rating?'opacity-30':''}>★</span>))}
                </div>
              </div>
              <p className="text-[11px] text-[var(--apple-text-secondary)]">{r.job} • {r.date}</p>
              <p className="text-[12px] leading-snug">{r.comment}</p>
            </Card>
          ))}
        </div>

        {open && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={()=>setOpen(false)} />
            <Card variant="soft" className="relative w-full sm:w-[520px] max-h-[90vh] overflow-y-auto p-8 space-y-8 rounded-t-3xl sm:rounded-3xl">
              <div className="flex items-start justify-between">
                <h3 className="text-[20px] font-semibold tracking-tight">New review</h3>
                <button onClick={()=>setOpen(false)} className="w-9 h-9 rounded-xl bg-[var(--apple-bg-alt)] border border-[var(--apple-border)] flex items-center justify-center text-[var(--apple-text-secondary)] hover:text-[var(--apple-text)]">✕</button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">Worker</p>
                  <Input 
                    placeholder="Worker name" 
                    value={worker}
                    onChange={(e) => setWorker(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">Service</p>
                  <Input 
                    placeholder="What service did they provide?" 
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-3">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">Rating</p>
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(r => (
                      <button 
                        key={r} 
                        type="button"
                        onClick={()=>setRating(r)} 
                        className={`w-12 h-12 rounded-2xl border text-[16px] font-semibold transition-all ${rating>=r ? 'bg-[var(--apple-accent)] text-white border-[var(--apple-accent)]' : 'border-[var(--apple-border)] text-[var(--apple-text-secondary)] hover:text-[var(--apple-text)] hover:border-[var(--apple-border-strong)]'}`}
                      >
                        ★{r}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">Comment</p>
                  <textarea 
                    placeholder="Tell us about your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full h-24 px-4 py-3 rounded-xl border border-[var(--apple-border)] bg-[var(--apple-bg)] text-[var(--apple-text)] placeholder:text-[var(--apple-text-secondary)] focus:outline-none focus:border-[var(--apple-accent)] resize-none"
                    required
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" className="flex-1" onClick={()=>setOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    Submit Review
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}