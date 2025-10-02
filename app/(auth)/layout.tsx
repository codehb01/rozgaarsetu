import { ReactNode } from "react";
import { WorkCategoryOrigami } from "@/components/ui/logo-origami";
import { AuroraBackground } from "@/components/ui/aurora-background";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <AuroraBackground className="min-h-[120vh] flex items-center justify-center p-6 pt-0">
      <div className="w-full max-w-6xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/20">
        <div className="flex min-h-[520px]">
          {/* Left Side - Form Only */}
          <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
            <div className="w-full px-4">
              {children}
            </div>
          </div>
          
          {/* Right Side - Visual */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-100/50 via-indigo-100/50 to-purple-100/50 dark:from-blue-900/30 dark:via-indigo-900/30 dark:to-purple-900/30 relative overflow-hidden backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-indigo-400/10 to-purple-400/10"></div>
            
            {/* Hero Content */}
            <div className="relative z-10 p-12 flex flex-col justify-center items-center text-center">
              {/* Logo/Brand */}
              <div className="mb-8">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3 shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                  </div>
                  <span className="text-3xl font-bold text-gray-800 dark:text-gray-100">RozgaarSetu</span>
                </div>
                
                {/* Dynamic Work Categories Display */}
                <div className="flex justify-center mb-8">
                  <WorkCategoryOrigami />
                </div>
              </div>
              
              <div className="mb-8">
                <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  Connect with Skilled Workers
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Join thousands of professionals building better futures together
                </p>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 text-center">
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">10K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Workers</div>
                </div>
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">50K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Jobs Done</div>
                </div>
                <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                  <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">4.9★</div>
                  <div className="text-sm text-gray-600 dark:text-gray-300">Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuroraBackground>
  );
};

export default AuthLayout;
