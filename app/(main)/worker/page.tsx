import { Card } from "@/components/ui/card"; // Updated path assuming components are in src/components (adjust if needed)
import { Button } from "@/components/ui/button"; // Updated path for consistency

export default function WorkerDashboard() {
  const pending = [
    { id: 1, job: 'Fan installation', distance: '1.1 km', price: 400 },
    { id: 2, job: 'Switch repair', distance: '0.7 km', price: 200 },
  ];
  const history = [
    { id: 7, job: 'Pipe leak fix', earned: 650 },
    { id: 8, job: 'Ceiling light install', earned: 500 },
    { id: 9, job: 'Socket replacement', earned: 280 }
  ];
  const payments = [
    { id: 'p1', label: 'Today', amount: '₹450' },
    { id: 'p2', label: 'This week', amount: '₹3,250' },
    { id: 'p3', label: 'This month', amount: '₹12,900' }
  ];

  return (
    <section className="space-y-10">
      <header className="space-y-1">
        <h2 className="text-[28px] font-semibold tracking-tight">Dashboard</h2>
        <p className="text-[13px] text-muted-foreground">Jobs, earnings & history overview</p> {/* Switched to Tailwind class for better compatibility; replace with your CSS var if preferred */}
      </header>

      <div className="grid gap-5 sm:grid-cols-3">
        {payments.map(p => (
          <Card key={p.id} className="p-5"> {/* Removed variant="soft" assuming Card handles it; add if needed */}
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{p.label}</p>
            <p className="mt-2 text-[26px] font-semibold leading-none">{p.amount}</p> {/* Removed CSS var; use text-foreground if needed */}
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6 space-y-5"> {/* Removed variant="soft" */}
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-semibold tracking-tight">Pending requests</h3>
            <Button variant="ghost" className="!h-8 px-3">Refresh</Button>
          </div>
          <div className="space-y-4">
            {pending.map(r => (
              <div key={r.id} className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium">{r.job}</p> {/* Removed CSS var */}
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {r.distance} • <span className="text-foreground font-semibold">₹{r.price}</span> {/* Switched to Tailwind */}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" className="!h-8 px-3">Reject</Button>
                  <Button className="!h-8 px-3">Accept</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-5"> {/* Removed variant="soft" */}
          <div className="flex items-center justify-between">
            <h3 className="text-[16px] font-semibold tracking-tight">Recent history</h3>
            <Button variant="ghost" className="!h-8 px-3">View all</Button>
          </div>
          <div className="space-y-4">
            {history.map(h => (
              <div key={h.id} className="flex items-center justify-between">
                <p className="text-[13px] font-medium">{h.job}</p> {/* Removed CSS var */}
                <span className="text-[12px] font-semibold text-emerald-600">₹{h.earned}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}