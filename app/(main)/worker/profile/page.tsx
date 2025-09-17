import Input from "../../../../components/ui/input";
import { Button} from "../../../../components/ui/button";
import { Card } from "../../../../components/ui/card";

export default function WorkerProfile() {
  return (
    <section className="space-y-8">
      <header className="space-y-1">
        <h2 className="text-[24px] font-semibold tracking-tight">My profile</h2>
        <p className="text-[13px] text-[var(--apple-text-secondary)]">Keep your details up to date</p>
      </header>
      <Card variant="soft" className="space-y-6 p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Input label="Full name" placeholder="Your name" />
          <Input label="Mobile number" placeholder="10-digit number" inputMode="numeric" />
          <Input label="Primary skill" placeholder="e.g., Electrician" />
          <Input label="Experience (years)" placeholder="e.g., 3" inputMode="numeric" />
          <Input label="Base price (₹)" placeholder="e.g., 199" inputMode="numeric" />
        </div>
        <div className="pt-2">
          <Button className="w-full md:w-auto px-8">Save changes</Button>
        </div>
      </Card>
    </section>
  );
}
