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
  description: "Simple platform fee model. Pay only when you complete work.",
};

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
              No subscriptions. No hidden fees. Pay only when work is completed.
            </p>
          </div>

          {/* Platform Fee Model */}
          <div className="mt-16 max-w-4xl mx-auto">
            <Card className="border-primary/40 shadow-lg">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Platform Fee Model</CardTitle>
                <CardDescription className="text-lg mt-2">
                  We charge a small platform fee only on completed jobs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* For Customers */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="text-2xl">👤</span> For Customers
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-6">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-primary">
                        5%
                      </span>
                      <span className="text-muted-foreground">
                        platform fee per completed job
                      </span>
                    </div>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">
                          ✓
                        </span>
                        <span>Unlimited job postings</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">
                          ✓
                        </span>
                        <span>Browse all worker profiles</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">
                          ✓
                        </span>
                        <span>Direct messaging with workers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">
                          ✓
                        </span>
                        <span>24/7 customer support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">
                          ✓
                        </span>
                        <span>Secure payment processing</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* For Workers */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="text-2xl">🔧</span> For Workers
                  </h3>
                  <div className="bg-muted/50 rounded-lg p-6">
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-4xl font-bold text-primary">
                        10%
                      </span>
                      <span className="text-muted-foreground">
                        platform fee per completed job
                      </span>
                    </div>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">
                          ✓
                        </span>
                        <span>Unlimited job leads</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">
                          ✓
                        </span>
                        <span>Professional profile showcase</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">
                          ✓
                        </span>
                        <span>Direct communication with customers</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">
                          ✓
                        </span>
                        <span>Fast & secure payments</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 dark:text-green-400">
                          ✓
                        </span>
                        <span>24/7 support & dispute resolution</span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Example Calculation */}
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-4">Example Calculation</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-4">
                      <p className="font-medium mb-2">Customer pays:</p>
                      <p className="text-muted-foreground">Job cost: ₹1,000</p>
                      <p className="text-muted-foreground">
                        Platform fee (5%): ₹50
                      </p>
                      <p className="font-semibold text-lg mt-2">
                        Total: ₹1,050
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-950 rounded-lg p-4">
                      <p className="font-medium mb-2">Worker receives:</p>
                      <p className="text-muted-foreground">Job cost: ₹1,000</p>
                      <p className="text-muted-foreground">
                        Platform fee (10%): -₹100
                      </p>
                      <p className="font-semibold text-lg mt-2">
                        Earnings: ₹900
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button asChild size="lg">
                  <Link href="/sign-up">Get Started Free</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Key Benefits */}
          <div className="mt-16 text-center">
            <h3 className="text-lg font-semibold mb-6">Why RozgaarSetu?</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
              <div className="p-4">
                <div className="text-3xl mb-2">💰</div>
                <span className="font-medium text-foreground block mb-1">
                  No subscriptions
                </span>
                <p className="text-muted-foreground">
                  No monthly fees or commitments
                </p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">✨</div>
                <span className="font-medium text-foreground block mb-1">
                  Pay per use
                </span>
                <p className="text-muted-foreground">
                  Only charged on completed work
                </p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">🔒</div>
                <span className="font-medium text-foreground block mb-1">
                  Secure payments
                </span>
                <p className="text-muted-foreground">
                  Safe and encrypted transactions
                </p>
              </div>
              <div className="p-4">
                <div className="text-3xl mb-2">🚀</div>
                <span className="font-medium text-foreground block mb-1">
                  Instant access
                </span>
                <p className="text-muted-foreground">
                  Start using all features immediately
                </p>
              </div>
            </div>
          </div>

          {/* FAQ teaser */}
          <p className="mt-10 text-center text-sm text-muted-foreground">
            Have questions about pricing? Reach out at
            <a
              className="text-primary underline-offset-4 hover:underline ml-1"
              href="mailto:support@rozgaarsetu.com"
            >
              support@rozgaarsetu.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
