import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pricing • RozgaarSetu",
  description:
    "Choose a plan that fits your needs. Simple, transparent pricing for customers and workers.",
};

// Customer Plans
const customerPlans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    description: "Perfect for occasional hiring needs",
    features: [
      "Up to 7 bookings per month",
      "Browse worker profiles",
      "Basic messaging",
      "Standard support",
    ],
    cta: { label: "Get Started", href: "/sign-up" },
    highlighted: false,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "For frequent hiring and priority service",
    features: [
      "Unlimited bookings",
      "Priority scheduling",
      "Priority customer support",
      "Advanced job management",
      "Faster worker responses",
    ],
    cta: { label: "Upgrade to Pro", href: "/sign-up" },
    highlighted: true,
  },
];

// Worker Plans
const workerPlans = [
  {
    name: "Free",
    price: "₹0",
    period: "/month",
    description: "Start earning with basic access",
    features: [
      "Up to 25 leads per month",
      "Basic profile visibility",
      "Standard messaging",
      "Basic support",
    ],
    cta: { label: "Get Started", href: "/sign-up" },
    highlighted: false,
  },
  {
    name: "Boost",
    price: "₹199",
    period: "/month",
    description: "Enhanced visibility and unlimited leads",
    features: [
      "Unlimited leads",
      "Featured profile placement",
      "Priority in search results",
      "Enhanced profile badges",
      "Priority support",
    ],
    cta: { label: "Get Boost", href: "/sign-up" },
    highlighted: true,
  },
  {
    name: "Pro",
    price: "₹199",
    period: "/month",
    description: "Maximum earning potential",
    features: [
      "Everything in Boost",
      "Top placement in search",
      "Verified professional badge",
      "Premium customer insights",
      "Dedicated account manager",
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
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Simple, transparent pricing
            </h1>
            <p className="mt-4 text-muted-foreground text-base sm:text-lg">
              Whether you&apos;re hiring or looking for work, pick a plan that
              fits. Upgrade anytime.
            </p>
          </div>

          {/* Customer Plans Section */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">For Customers</h2>
              <p className="text-muted-foreground">
                Find and hire skilled workers
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              {customerPlans.map((plan) => (
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
                      <span className="text-3xl font-semibold">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                      {plan.features.map((feature: string) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 rounded-full bg-primary/70" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      <Link href={plan.cta.href}>{plan.cta.label}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Worker Plans Section */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">For Workers</h2>
              <p className="text-muted-foreground">
                Grow your business and earn more
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-3">
              {workerPlans.map((plan) => (
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
                      <span className="text-3xl font-semibold">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                    <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                      {plan.features.map((feature: string) => (
                        <li key={feature} className="flex items-start gap-2">
                          <span className="mt-1 size-1.5 rounded-full bg-primary/70" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      asChild
                      className="w-full"
                      variant={plan.highlighted ? "default" : "outline"}
                    >
                      <Link href={plan.cta.href}>{plan.cta.label}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Key Benefits */}
          <div className="mt-16 text-center">
            <h3 className="text-lg font-semibold mb-4">Why upgrade?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">
                  No hidden fees
                </span>
                <p>Transparent pricing with no setup costs</p>
              </div>
              <div>
                <span className="font-medium text-foreground">
                  Cancel anytime
                </span>
                <p>Flexible subscriptions you can pause or cancel</p>
              </div>
              <div>
                <span className="font-medium text-foreground">
                  Instant upgrade
                </span>
                <p>Start benefiting immediately after upgrade</p>
              </div>
            </div>
          </div>

          {/* FAQ teaser */}
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Have questions about pricing? Reach out at
            <a
              className="text-primary underline-offset-4 hover:underline ml-1"
              href="#"
            >
              {" "}
              support@rozgaarsetu.example
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
