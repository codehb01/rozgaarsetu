import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing • RozgaarSetu",
  description: "Choose a plan that fits your needs. Simple, transparent pricing for customers and workers.",
};

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Post a job and connect with local workers",
    features: [
      "Create a customer account",
      "Browse worker profiles",
      "Post basic job requests",
      "In-app messaging",
    ],
    cta: { label: "Get Started", href: "/sign-up" },
    highlighted: false,
  },
  {
    name: "Standard",
    price: "₹199",
    period: "/month",
    description: "Better visibility and faster hiring",
    features: [
      "Priority job posting",
      "Featured placement in search",
      "Faster responses from workers",
      "Basic support",
    ],
    cta: { label: "Choose Standard", href: "/sign-up" },
    highlighted: true,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "For teams and frequent hiring",
    features: [
      "Unlimited job posts",
      "Top placement in search",
      "Verified worker recommendations",
      "Priority support",
    ],
    cta: { label: "Go Pro", href: "/sign-up" },
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="bg-gradient-to-b from-background to-background/80">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Simple, transparent pricing</h1>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              Whether you&apos;re hiring or looking for work, pick a plan that fits. Upgrade anytime.
            </p>
          </div>

          {/* Cards */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={
                  plan.highlighted
                    ? "border-primary/40 shadow-md ring-1 ring-primary/20"
                    : ""
                }
              >
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-1 size-1.5 rounded-full bg-primary/70" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                    <Link href={plan.cta.href}>{plan.cta.label}</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* FAQ teaser */}
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Have questions about pricing? Reach out at
            <a className="text-primary underline-offset-4 hover:underline ml-1" href="#"> support@rozgaarsetu.example</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
