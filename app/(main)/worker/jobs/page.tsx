import { Card } from "../../../../components/ui/card";
import { Button } from "../../../../components/ui/button";

const jobs = [
  { id: 1, title: "Switch repair", when: "Today 2:30 PM", distance: "0.9 km", price: 250, status: "New" },
  { id: 2, title: "Water leakage fix", when: "Tomorrow 10:00 AM", distance: "2.1 km", price: 600, status: "Pending" },
];

export default function WorkerJobs() {
  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <h2 className="text-[24px] font-semibold tracking-tight">Jobs</h2>
        <p className="text-[13px] text-[var(--apple-text-secondary)]">Incoming opportunities near you</p>
      </header>
      <div className="grid gap-4">
        {jobs.map((j) => (
          <Card key={j.id} variant="soft" className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 hover:bg-white/60">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[15px] text-[var(--apple-text)]">{j.title}</p>
              <p className="text-[12px] mt-1 text-[var(--apple-text-secondary)]">{j.when} • {j.distance} • <span className="text-[var(--apple-text)] font-semibold">₹{j.price}</span></p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" className="!h-9 px-4">Details</Button>
              <Button className="!h-9 px-5">Accept</Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
