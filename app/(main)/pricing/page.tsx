import Header from "../../../components/header";
import { Button } from "../../../components/ui/button";
import { Card } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Check, Zap, Crown, Users } from "lucide-react";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-900 overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 text-center mt-16">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="animate-fade-in-up">
            <Badge className="bg-blue-600/20 text-blue-400 border-blue-600/30 px-4 py-2 text-sm font-medium mb-6">
              Simple Pricing
            </Badge>
            <h1 className="text-5xl md:text-6xl font-light text-white tracking-tight leading-tight">
              Choose Your <span className="text-blue-400">Plan</span>
            </h1>
          </div>

          <div className="animate-fade-in-up delay-300">
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Flexible pricing for workers and businesses of all sizes.
              <br className="hidden md:block" />
              <span className="text-blue-400 font-medium">
                Start free, upgrade when you grow.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards Section */}
      <section className="relative mx-auto max-w-7xl px-6 py-16">
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
          {/* Free Plan */}
          <div className="animate-slide-in-left delay-100">
            <Card className="p-8 bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-all duration-500 transform hover:scale-105 relative">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    Starter
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Perfect for getting started
                  </p>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-white">₹0</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      Up to 5 job applications
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      Basic profile creation
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      Location-based job search
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      Basic customer support
                    </span>
                  </li>
                  <li className="flex items-center space-x-3 opacity-50">
                    <div className="w-5 h-5 border border-gray-600 rounded flex-shrink-0"></div>
                    <span className="text-gray-500">Priority job matching</span>
                  </li>
                  <li className="flex items-center space-x-3 opacity-50">
                    <div className="w-5 h-5 border border-gray-600 rounded flex-shrink-0"></div>
                    <span className="text-gray-500">Advanced analytics</span>
                  </li>
                </ul>

                <Button
                  variant="outline"
                  className="w-full py-3 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 transition-all duration-300"
                >
                  Get Started Free
                </Button>
              </div>
            </Card>
          </div>

          {/* Pro Plan */}
          <div className="animate-slide-in-up delay-200 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <Badge className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 text-sm font-medium">
                Most Popular
              </Badge>
            </div>
            <Card className="p-8 bg-gradient-to-b from-blue-900/20 to-gray-800/50 border-blue-600/50 hover:bg-gray-800 transition-all duration-500 transform hover:scale-105 relative">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    Professional
                  </h3>
                  <p className="text-gray-400 mb-4">For active job seekers</p>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-white">₹299</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-sm text-blue-400 mt-2">
                    Save 20% with yearly plan
                  </p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      Unlimited job applications
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      Enhanced profile with portfolio
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">Priority job matching</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      Instant payment processing
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">24/7 priority support</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">Performance analytics</span>
                  </li>
                </ul>

                <Button className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25">
                  Start Professional
                </Button>
              </div>
            </Card>
          </div>

          {/* Enterprise Plan */}
          <div className="animate-slide-in-right delay-300">
            <Card className="p-8 bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-all duration-500 transform hover:scale-105 relative">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    Enterprise
                  </h3>
                  <p className="text-gray-400 mb-4">
                    For businesses & contractors
                  </p>
                  <div className="text-center">
                    <span className="text-4xl font-bold text-white">₹999</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                  <p className="text-sm text-purple-400 mt-2">
                    Custom solutions available
                  </p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      Unlimited job postings
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      Advanced worker filtering
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">Team management tools</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">Custom branding</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      Dedicated account manager
                    </span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">
                      API access & integrations
                    </span>
                  </li>
                </ul>

                <Button
                  variant="outline"
                  className="w-full py-3 border-purple-600 text-purple-400 hover:bg-purple-900/20 hover:border-purple-500 transition-all duration-300"
                >
                  Contact Sales
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            Compare Plans
          </h2>
          <p className="text-xl text-gray-400">
            See what&apos;s included in each plan
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">Features</h3>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-gray-400">Starter</h3>
              </div>
              <div className="p-4 text-center bg-blue-900/20 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-400">
                  Professional
                </h3>
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold text-purple-400">
                  Enterprise
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  feature: "Job Applications",
                  starter: "5/month",
                  pro: "Unlimited",
                  enterprise: "Unlimited",
                },
                {
                  feature: "Profile Features",
                  starter: "Basic",
                  pro: "Enhanced",
                  enterprise: "Premium",
                },
                {
                  feature: "Priority Support",
                  starter: "✗",
                  pro: "✓",
                  enterprise: "✓",
                },
                {
                  feature: "Analytics",
                  starter: "✗",
                  pro: "Basic",
                  enterprise: "Advanced",
                },
                {
                  feature: "Team Management",
                  starter: "✗",
                  pro: "✗",
                  enterprise: "✓",
                },
                {
                  feature: "API Access",
                  starter: "✗",
                  pro: "✗",
                  enterprise: "✓",
                },
              ].map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 py-4 border-b border-gray-800"
                >
                  <div className="p-2">
                    <span className="text-gray-300">{row.feature}</span>
                  </div>
                  <div className="p-2 text-center">
                    <span className="text-gray-400">{row.starter}</span>
                  </div>
                  <div className="p-2 text-center bg-blue-900/10 rounded">
                    <span className="text-blue-400">{row.pro}</span>
                  </div>
                  <div className="p-2 text-center">
                    <span className="text-purple-400">{row.enterprise}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative mx-auto max-w-4xl px-6 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about our pricing
          </p>
        </div>

        <div className="space-y-6">
          {[
            {
              q: "Can I change my plan anytime?",
              a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and you'll be charged prorated amounts.",
            },
            {
              q: "Is there a free trial for paid plans?",
              a: "Yes, we offer a 14-day free trial for all paid plans. No credit card required to start your trial.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, UPI, net banking, and digital wallets. All payments are processed securely.",
            },
            {
              q: "Do you offer refunds?",
              a: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with our service, we'll provide a full refund.",
            },
          ].map((faq, index) => (
            <Card
              key={index}
              className="p-6 bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-all duration-300"
            >
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative z-10 space-y-8 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-light text-white">
            Ready to get started?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of workers and businesses already using RozgaarSetu
            to transform their careers and operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-12 py-4 rounded-full text-lg font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              Start Free Trial
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-12 py-4 rounded-full border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 text-lg font-medium transform hover:scale-105 transition-all duration-300"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
