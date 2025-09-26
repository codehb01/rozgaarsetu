"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useGoogleTranslation } from "@/hooks/use-google-translation";
import { useLanguage } from "@/contexts/language-context";

function PricingSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-8">
              <div className="text-center space-y-4">
                <Skeleton className="h-6 w-24 mx-auto" />
                <Skeleton className="h-12 w-32 mx-auto" />
                <Skeleton className="h-4 w-40 mx-auto" />
              </div>
              <div className="mt-8 space-y-3">
                {Array.from({ length: 5 }).map((_, j) => (
                  <div key={j} className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PricingPlanCard({ plan }: { plan: any }) {
  const { translatedText: translatedName, isLoading: isNameLoading } = useGoogleTranslation(
    plan.name, 
    `plan-${plan.id}-name`, 
    'title'
  );
  
  const { translatedText: translatedDescription, isLoading: isDescLoading } = useGoogleTranslation(
    plan.description, 
    `plan-${plan.id}-description`, 
    'description'
  );
  
  const { translatedText: translatedPeriod, isLoading: isPeriodLoading } = useGoogleTranslation(
    plan.period, 
    `plan-${plan.id}-period`, 
    'other'
  );

  const { translatedText: mostPopularText, isLoading: isPopularLoading } = useGoogleTranslation(
    "Most Popular", 
    "pricing-most-popular", 
    'other'
  );

  const { translatedText: getStartedFreeText, isLoading: isStartedLoading } = useGoogleTranslation(
    "Get Started Free", 
    "pricing-get-started-free", 
    'other'
  );

  const { translatedText: startFreeTrialText, isLoading: isTrialLoading } = useGoogleTranslation(
    "Start Free Trial", 
    "pricing-start-trial", 
    'other'
  );

  // Translate features
  const featureTranslations = plan.features.map((feature: string, index: number) => 
    useGoogleTranslation(feature, `plan-${plan.id}-feature-${index}`, 'other')
  );

  const isLoading = isNameLoading || isDescLoading || isPeriodLoading || 
                   featureTranslations.some((f: any) => f.isLoading);

  return (
    <div 
      className={`relative bg-white rounded-lg shadow-sm border-2 p-8 ${
        plan.popular ? 'border-blue-500' : 'border-gray-200'
      }`}
    >
      {plan.popular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
            {isPopularLoading ? "Most Popular" : mostPopularText}
          </span>
        </div>
      )}
      
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {isNameLoading ? plan.name : translatedName}
        </h3>
        <div className="mb-4">
          <span className="text-4xl font-bold text-gray-900">₹{plan.price}</span>
          <span className="text-gray-600 ml-2">
            {isPeriodLoading ? plan.period : translatedPeriod}
          </span>
        </div>
        <p className="text-gray-600 mb-8">
          {isDescLoading ? plan.description : translatedDescription}
        </p>
      </div>

      <ul className="space-y-4 mb-8">
        {plan.features.map((feature: string, index: number) => (
          <li key={index} className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-700">
              {featureTranslations[index]?.isLoading ? feature : featureTranslations[index]?.translatedText}
            </span>
          </li>
        ))}
      </ul>

      <button 
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          plan.popular 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        {plan.price === 0 
          ? (isStartedLoading ? "Get Started Free" : getStartedFreeText)
          : (isTrialLoading ? "Start Free Trial" : startFreeTrialText)
        }
      </button>
      
      {isLoading && (
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
            <span>Translating...</span>
          </div>
        </div>
      )}
    </div>
  );
}

function FAQCard({ faq }: { faq: any }) {
  const { translatedText: translatedQuestion, isLoading: isQuestionLoading } = useGoogleTranslation(
    faq.question, 
    `faq-${faq.id}-question`, 
    'other'
  );
  
  const { translatedText: translatedAnswer, isLoading: isAnswerLoading } = useGoogleTranslation(
    faq.answer, 
    `faq-${faq.id}-answer`, 
    'other'
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="font-semibold text-gray-900 mb-2">
        {isQuestionLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>{faq.question}</span>
          </div>
        ) : (
          translatedQuestion
        )}
      </h3>
      <div className="text-gray-600">
        {isAnswerLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span>{faq.answer}</span>
          </div>
        ) : (
          translatedAnswer
        )}
      </div>
    </div>
  );
}

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [pricing, setPricing] = useState<{plans: any[], faqs: any[]} | null>(null);
  
  // Header translations
  const { translatedText: headerTitle, isLoading: isTitleLoading } = useGoogleTranslation(
    "Simple, Transparent Pricing",
    "pricing-header-title",
    "title"
  );

  const { translatedText: headerSubtitle, isLoading: isSubtitleLoading } = useGoogleTranslation(
    "Choose the perfect plan for your business needs",
    "pricing-header-subtitle",
    "description"
  );

  const { translatedText: faqSectionTitle, isLoading: isFaqTitleLoading } = useGoogleTranslation(
    "Frequently Asked Questions",
    "pricing-faq-title",
    "title"
  );

  // Mock data
  const mockPricingData = {
    plans: [
      {
        id: "basic",
        name: "Basic",
        price: 0,
        period: "Free",
        description: "Perfect for getting started",
        features: [
          "Create worker profile",
          "Receive up to 10 job requests/month",
          "Basic customer support",
          "Mobile app access",
          "Payment processing"
        ],
        popular: false
      },
      {
        id: "premium",
        name: "Premium",
        price: 299,
        period: "per month",
        description: "Best for active workers",
        features: [
          "Everything in Basic",
          "Unlimited job requests",
          "Priority listing in search",
          "Advanced analytics",
          "24/7 customer support",
          "Custom profile themes",
          "Marketing tools"
        ],
        popular: true
      },
      {
        id: "business",
        name: "Business",
        price: 599,
        period: "per month", 
        description: "For teams and agencies",
        features: [
          "Everything in Premium",
          "Team management",
          "Multi-location support",
          "API access",
          "White-label solution",
          "Dedicated account manager",
          "Custom integrations"
        ],
        popular: false
      }
    ],
    faqs: [
      {
        id: "change-plan",
        question: "Can I change my plan anytime?",
        answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
      },
      {
        id: "free-trial",
        question: "Is there a free trial?",
        answer: "We offer a 14-day free trial for all paid plans. No credit card required to get started."
      },
      {
        id: "payment-methods",
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards, UPI, net banking, and digital wallets for your convenience."
      }
    ]
  };

  useEffect(() => {
    const loadPricing = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setPricing(mockPricingData);
      } catch (error) {
        console.error("Error loading pricing:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPricing();
  }, []);

  if (isLoading) {
    return <PricingSkeleton />;
  }

  const isTranslating = isTitleLoading || isSubtitleLoading || isFaqTitleLoading;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Language Switcher */}
        <div className="flex justify-end mb-6">
          <LanguageSwitcher />
        </div>
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {isTitleLoading ? "Simple, Transparent Pricing" : headerTitle}
          </h1>
          <p className="text-xl text-gray-600">
            {isSubtitleLoading ? "Choose the perfect plan for your business needs" : headerSubtitle}
          </p>
          {isTranslating && (
            <div className="flex items-center justify-center mt-4 space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm text-gray-500">Translating page content...</span>
            </div>
          )}
        </div>

        {pricing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricing.plans.map((plan) => (
              <PricingPlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        )}

        {/* FAQ Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {isFaqTitleLoading ? "Frequently Asked Questions" : faqSectionTitle}
          </h2>
          <div className="max-w-3xl mx-auto text-left">
            <div className="space-y-6">
              {pricing?.faqs.map((faq) => (
                <FAQCard key={faq.id} faq={faq} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}