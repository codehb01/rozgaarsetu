import { Button } from "../ui/button";
import { Card } from "../ui/card";

type Props = {
  name: string;
  skill: string;
  rating?: number;
  distanceKm?: number;
  priceFrom?: number;
};

export default function WorkerCard({ name, skill, rating = 4.8, distanceKm = 1.2, priceFrom = 199 }: Props) {
  return (
    <Card className="flex items-center gap-5 group hover:translate-y-[-2px]">
      <div className="relative h-14 w-14 shrink-0 rounded-2xl bg-[var(--apple-bg-alt)] grid place-items-center font-semibold text-[var(--apple-text)] text-lg border border-[var(--apple-border)] shadow-sm group-hover:shadow-md transition-base">
        <span>{name[0]}</span>
        <span className="absolute -bottom-1 -right-1 text-[10px] px-1.5 py-0.5 rounded-full bg-[var(--apple-accent)] text-white shadow">{rating.toFixed(1)}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-[var(--apple-text)] leading-tight">{name}</p>
          <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-[var(--apple-accent)]/12 text-[var(--apple-accent)] font-medium">{skill}</span>
        </div>
        <p className="text-[12px] text-[var(--apple-text-secondary)] mt-1">{distanceKm} km • Starts ₹{priceFrom}</p>
      </div>
      <Button variant="secondary" className="!h-9 px-4">View</Button>
    </Card>
  );
}
