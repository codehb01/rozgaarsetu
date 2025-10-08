"use client";

import { ReactNode } from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import CountUp from "@/components/CountUp";
import { WorkCategoryOrigami } from "@/components/ui/logo-origami";
import ShimmerText from "@/components/kokonutui/shimmer-text";
import { motion } from "framer-motion";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuroraBackground className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden">
      <motion.div 
        className="relative z-10 w-full max-w-6xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white/95 dark:bg-black/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
          <div className="grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <motion.div 
              className="flex items-center justify-center p-6 sm:p-8 md:p-12 lg:p-16 bg-white dark:bg-black min-h-[500px] lg:min-h-[600px]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="w-full max-w-sm">
                {children}
              </div>
            </motion.div>
            
            {/* Right Side - Visual */}
            <motion.div 
              className="hidden lg:flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 dark:from-slate-900 dark:via-black dark:to-slate-950 relative overflow-hidden min-h-[600px]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Minimal Decorative Elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/40 dark:bg-slate-600/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/40 dark:bg-slate-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 text-center space-y-8 max-w-md">
                {/* Logo Origami */}
                <div className="flex justify-center">
                  <WorkCategoryOrigami />
                </div>
                
                <div className="space-y-4">
                  <ShimmerText
                    text="RozgaarSetu"
                    className="text-5xl font-semibold text-slate-800 dark:text-white tracking-tight"
                  />
                  <h2 className="text-xl text-slate-700 dark:text-slate-200 font-medium animate-fade-in">
                    Connect with Skilled Workers
                  </h2>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed animate-fade-in-delay">
                    Join thousands of professionals building better futures
                  </p>
                </div>
                
                {/* Stats with CountUp Animation */}
                <div className="grid grid-cols-3 gap-3 pt-6">
                  <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-slate-300/50 dark:border-slate-600/30 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 shadow-sm">
                    <div className="text-3xl font-semibold text-slate-800 dark:text-white mb-1">
                      <CountUp to={10} duration={2.5} className="inline" />K+
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">Workers</div>
                  </div>
                  <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-slate-300/50 dark:border-slate-600/30 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 shadow-sm">
                    <div className="text-3xl font-semibold text-slate-800 dark:text-white mb-1">
                      <CountUp to={50} duration={2.5} className="inline" />K+
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">Jobs Done</div>
                  </div>
                  <div className="bg-white/60 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-slate-300/50 dark:border-slate-600/30 hover:bg-white/80 dark:hover:bg-white/10 transition-all duration-300 hover:scale-105 shadow-sm">
                    <div className="text-3xl font-semibold text-slate-800 dark:text-white mb-1">
                      <CountUp to={4.9} duration={2.5} className="inline" />★
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">Rating</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  );
};

export default AuthLayout;
