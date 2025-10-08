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
  Info,
  HelpCircle,
  Shield,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

export default function HelpPage() {
  const faqs = [
    {
      question: "What is RozgaarSetu?",
      answer:
        "RozgaarSetu is a digital bridge connecting customers with verified blue-collar workers such as plumbers, electricians, drivers, cleaners, and more. It helps customers find skilled professionals easily and enables workers to get fair and frequent job opportunities.",
    },
    {
      question: "How do I book a worker?",
      answer:
        "Browse through categories or search for the required profession. Once you find a worker, click on the 'Book Worker' button, provide your project details, and confirm your booking. You’ll receive a confirmation and can track your booking status from your dashboard.",
    },
    {
      question: "Is there a limit to how many workers I can book?",
      answer:
        "Free-tier customers can book a limited number of workers per week. For unlimited bookings and premium support, you can explore our subscription plans from the Pricing section.",
    },
    {
      question: "How are workers verified?",
      answer:
        "All workers undergo a basic verification process, including ID proof and skill validation. RozgaarSetu ensures transparency and safety for both customers and workers.",
    },
    {
      question: "What if the worker doesn't show up or cancels?",
      answer:
        "If a worker fails to arrive, you can report the issue directly from your booking details page. Our support team will help you reschedule or refund your booking as per our cancellation policy.",
    },
    {
      question: "How do I contact support?",
      answer:
        "You can reach our support team via email, chat, or phone. Scroll below for the contact details.",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="space-y-2 text-center">
        <div className="flex justify-center mb-2">
          <HelpCircle className="h-10 w-10 text-blue-600 dark:text-blue-400 mt-20" />
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">
          Help & Support
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Have questions about using RozgaarSetu? Find answers, guidance, and
          support below.
        </p>
      </div>

      {/* FAQs Section */}
      <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <Info className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
          Frequently Asked Questions
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
            Reach us at <span className="font-medium">+91 98765 43210</span>
          </p>
        </Card>

        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-center">
          <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Email Support
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Write to us at{" "}
            <span className="font-medium">support@rozgaarsetu.com</span>
          </p>
        </Card>

        <Card className="p-6 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-center">
          <MessageSquare className="h-8 w-8 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Live Chat
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Chat with our team 9AM – 6PM IST daily.
          </p>
          <Link href="#">
            <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm rounded-md transition-all duration-200">
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
              Safety and Trust Commitment
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              RozgaarSetu prioritizes the safety of both customers and workers.
              All profiles are verified, and your data is protected using
              industry-standard security measures.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
