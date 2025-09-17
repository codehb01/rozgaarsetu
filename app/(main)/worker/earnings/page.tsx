import { Card } from "../../../../components/ui/card";

export default function WorkerEarnings() {
  const stats = [
    { label: 'Today', value: '₹450', delta: '+12%' },
    { label: 'This week', value: '₹3,250', delta: '+8%' },
    { label: 'This month', value: '₹12,900', delta: '+5%' }
  ];
  return (
    <section className="space-y-10">
      <header className="space-y-1">
        <h2 className="text-[24px] font-semibold tracking-tight">Earnings</h2>
        <p className="text-[13px] text-[var(--apple-text-secondary)]">Your recent performance overview</p>
      </header>
      <div className="grid gap-5 sm:grid-cols-3">
        {stats.map(s => (
          <Card key={s.label} variant="soft" className="p-5">
            <p className="text-[11px] uppercase tracking-wide text-[var(--apple-text-secondary)]">{s.label}</p>
            <p className="mt-2 text-[28px] font-semibold leading-none text-[var(--apple-text)]">{s.value}</p>
            <p className="mt-1 text-[11px] font-medium text-emerald-600">{s.delta}</p>
          </Card>
        ))}
      </div>
      <p className="text-[11px] text-[var(--apple-text-secondary)]">Tip: Complete more jobs during peak hours (6–9 PM) to earn more.</p>
    </section>
  );
}
