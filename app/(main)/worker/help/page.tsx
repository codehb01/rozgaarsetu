"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  UserCheck,
  Wallet,
  Shield,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default function WorkerHelpPage() {
  const faqs = [
    {
      question: "What is RozgaarSetu for Workers?",
      answer:
        "RozgaarSetu helps skilled workers like plumbers, electricians, drivers, cleaners, and other professionals connect directly with customers who need their services. It ensures fair opportunities and consistent job access.",
    },
    {
      question: "How can I register as a worker?",
      answer:
        "You can sign up using your mobile number or email, complete your basic profile, and upload your ID proof for verification. Once approved, you’ll start receiving job requests from nearby customers.",
    },
    {
      question: "How do I get job bookings?",
      answer:
        "Once your account is verified, customers can view your profile and hire you for tasks. You’ll get job notifications in your dashboard, and you can accept or decline based on your availability.",
    },
    {
      question: "When and how do I receive payments?",
      answer:
        "Payments are made directly to your registered bank account or UPI after successful job completion. RozgaarSetu ensures transparent transactions with low service charges.",
    },
    {
      question: "What if a customer cancels or doesn’t pay?",
      answer:
        "In case of cancellations or payment disputes, raise a complaint from your 'My Jobs' section. Our support team will verify and assist in resolving the issue promptly.",
    },
    {
      question: "How do I improve my visibility and ratings?",
      answer:
        "Complete your profile, upload genuine work photos, and maintain good ratings from customers. Higher ratings and verified profiles are shown first to potential clients.",
    },
    {
      question: "Is there any subscription or limit for workers?",
      answer:
        "Basic accounts can receive a limited number of job requests per week. For more visibility, unlimited requests, and premium support, you can upgrade to a Pro Worker Plan.",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <HelpCircle className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mt-20" />
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Worker Help & Support
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Everything you need to know about using RozgaarSetu as a worker — from
          registration to payments and support.
        </p>
      </div>

      {/* FAQs Section */}
      <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <UserCheck className="h-5 w-5 mr-2 text-emerald-600 dark:text-emerald-400" />
          Common Questions for Workers
        </h2>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`faq-${index}`}>
              <AccordionTrigger className="text-left text-gray-900 dark:text-gray-100 font-medium">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 dark:text-gray-400 text-sm">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card>

      {/* Support Contact Section */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-center">
          <Phone className="h-8 w-8 text-green-600 dark:text-green-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Call Support
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Call us at <span className="font-medium">+91 98765 43210</span>
          </p>
        </Card>

        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-center">
          <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Email Support
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Write to us at{" "}
            <span className="font-medium">workersupport@rozgaarsetu.com</span>
          </p>
        </Card>

        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-center">
          <MessageSquare className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Live Chat
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Chat with our RozgaarSetu support team from 9AM – 6PM daily.
          </p>
          <Link href="#">
            <button className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 text-sm rounded-md transition-all duration-200">
              Start Chat
            </button>
          </Link>
        </Card>
      </div>

      {/* Safety Section */}
      <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <div className="flex items-start gap-3">
          <Shield className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Worker Protection & Safety
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              RozgaarSetu values worker dignity and safety. We verify all
              customers, ensure secure payments, and provide direct support for
              disputes or emergencies. Your data and work records remain fully
              confidential.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
