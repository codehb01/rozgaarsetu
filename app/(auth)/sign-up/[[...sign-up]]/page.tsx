"use client";

import { SignUp } from "@clerk/nextjs";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { motion } from "framer-motion";

const SignUpPage = () => {
  const words = [
    {
      text: "Join",
    },
    {
      text: "the",
    },
    {
      text: "future",
    },
    {
      text: "of",
    },
    {
      text: "work",
      className: "text-blue-600 dark:text-blue-400",
    },
  ];

  const flipWords = ["opportunities", "growth", "success", "careers"];

  return (
    <div className="space-y-8">
      {/* Apple-style header section */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
            <TypewriterEffect words={words} />
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="max-w-md mx-auto"
        >
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Create your account and discover endless{" "}
            <FlipWords 
              words={flipWords}
              duration={2500}
              className="text-blue-600 dark:text-blue-400 font-semibold"
            />
          </p>
        </motion.div>
      </div>

      {/* Clerk Sign-up component with Apple-style wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
        className="relative"
      >
        {/* Premium glassmorphism background */}
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50"></div>
        
        {/* Content container */}
        <div className="relative z-10 p-8 rounded-2xl">
          <SignUp 
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none border-none p-0",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl py-3 font-medium transition-all duration-200 hover:scale-[1.02]",
                socialButtonsBlockButtonText: "font-medium",
                dividerLine: "bg-gray-300 dark:bg-gray-600",
                dividerText: "text-gray-500 dark:text-gray-400 font-medium",
                formFieldInput: "bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl py-3 px-4 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200",
                formFieldLabel: "text-gray-700 dark:text-gray-300 font-medium mb-2",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3 font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-blue-500/25",
                footerActionLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200",
                identityPreviewText: "text-gray-600 dark:text-gray-400",
                identityPreviewEditButton: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200",
                formFieldSuccessText: "text-green-600 dark:text-green-400 text-sm",
                formFieldErrorText: "text-red-600 dark:text-red-400 text-sm"
              }
            }}
          />
        </div>
      </motion.div>

      {/* Apple-style footer text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="text-center"
      >
        <p className="text-sm text-gray-500 dark:text-gray-400">
          By creating an account, you agree to our{" "}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200">
            Privacy Policy
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUpPage;
