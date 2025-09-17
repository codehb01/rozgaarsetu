import Link from "next/link";
import Input from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import WorkerCard from "../../../../components/ui/worker-card";
import { Card, CardHeader } from "../../../../components/ui/card"; // Ensure Card supports 'variant' prop or remove it below

export default function CustomerHome() {
  const bookings = [
    { id:1, worker:'Ravi Singh', job:'Fan installation', when:'Today 5 PM', status:'Pending' },
    { id:2, worker:'Neha Joshi', job:'Deep cleaning', when:'Tomorrow 11 AM', status:'Confirmed' },
  ];
  const payments = [
    { id:'pm1', label:'This month', value:'₹5,600' },
    { id:'pm2', label:'Total spent', value:'₹28,400' },
    { id:'pm3', label:'Active bookings', value:'3' },
  ];
  const reviews = [
    { id:11, worker:'Sunil Rao', job:'Pipe repair', rating:5 },
    { id:12, worker:'Imran Khan', job:'Wall painting', rating:4 },
  ];
  return (
    <section className="space-y-12">
      <header className="pt-16 space-y-1">
  <h2 className="text-[28px] font-semibold tracking-tight">
    Employer Dashboard
  </h2>
  <p className="text-[13px] text-[var(--apple-text-secondary)]">
    Manage search, bookings & payments
  </p>
</header>

      <Card className="p-6 space-y-5">
        <div className="mb-2">
          <h3 className="text-[16px] font-semibold">Find a worker</h3>
          <p className="text-[12px] text-[var(--apple-text-secondary)]">Search by skill or job name</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input placeholder="e.g., plumber, electrician" className="flex-1" />
          <Button className="sm:w-auto w-full">Search</Button>
        </div>
        <div className="flex gap-2 flex-wrap text-[11px]">
          {['Plumber','Electrician','Cook','Painter','Cleaner','Carpenter'].map(tag => (
            <button key={tag} className="px-3 h-8 rounded-full bg-[var(--apple-bg-alt)] text-[var(--apple-text-secondary)] hover:text-[var(--apple-text)] hover:bg-white border border-[var(--apple-border)] text-[11px] font-medium transition-base">{tag}</button>
          ))}
        </div>
      </Card>

      <div className="grid gap-6 sm:grid-cols-3">
        {payments.map(p => (
          <Card key={p.id} className="p-5">
            <p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">{p.label}</p>
            <p className="mt-2 text-[26px] font-semibold leading-none text-[var(--apple-text)]">{p.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-semibold tracking-tight">Upcoming bookings</h3>
            <Button variant="ghost" className="!h-8 px-3">New</Button>
          </div>
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b.id} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium">{b.job}</p>
                  <p className="text-[11px] text-[var(--apple-text-secondary)] mt-0.5">{b.worker} • {b.when}</p>
                </div>
                <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${b.status==='Pending' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{b.status}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-semibold tracking-tight">Recent reviews</h3>
            <Button variant="ghost" className="!h-8 px-3">Add</Button>
          </div>
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r.id} className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium">{r.worker}</p>
                  <p className="text-[11px] text-[var(--apple-text-secondary)] mt-0.5">{r.job}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({length:5}).map((_,i)=>(
                    <span key={i} className={`text-[var(--apple-accent)] ${i>=r.rating?'opacity-30':''}`}>★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[18px] font-semibold tracking-tight">Popular near you</h3>
          <Link href="/customer/search" className="text-[12px] font-medium text-[var(--apple-accent)] hover:underline">See all</Link>
        </div>
        <div className="grid gap-4">
          <WorkerCard name="Amit Kumar" skill="Electrician" />
          <WorkerCard name="Priya Patil" skill="Plumber" />
          <WorkerCard name="Suresh Yadav" skill="Cleaner" />
        </div>
      </div>
    </section>
  );
}
