'use client'
import { useEffect, useState } from "react";
import Lenis from 'lenis';
import { motion } from 'framer-motion';
import StickyFooter from "@/components/sticky-footer";
import { MainMenusGradientCard } from "@/components/eldoraui/animatedcard";
import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AuroraText } from "@/components/ui/aurora-text";
import { StatsSkeleton } from "@/components/ui/dashboard-skeleton";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import ScrollText from "@/components/kokonutui/scroll-text";
import TypewriterTitle from "@/components/kokonutui/type-writer";
import ShimmerText from "@/components/kokonutui/shimmer-text";
import { TypewriterEffect } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { FlipWords } from "@/components/ui/flip-words";
import { Skeleton } from "@/components/ui/skeleton";
import ShapeHero from "@/components/kokonutui/shape-hero";

export default function Home() {
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isFeaturesLoading, setIsFeaturesLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect( () => {
    // Simple Lenis setup that works better with sticky elements
    const lenis = new Lenis()

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    // Simulate loading states
    const statsTimer = setTimeout(() => setIsStatsLoading(false), 1500);
    const featuresTimer = setTimeout(() => setIsFeaturesLoading(false), 2000);

    // Scroll to top button visibility
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      lenis.destroy()
      clearTimeout(statsTimer);
      clearTimeout(featuresTimer);
      window.removeEventListener('scroll', handleScroll);
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section with ShapeHero */}
      <ShapeHero 
        title1="Connect. Work."
        title2="Grow."
        subtitle="The modern platform connecting blue-collar workers with opportunities."
      />

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light text-gray-900 dark:text-white mb-4">
            Why Choose RozgaarSetu?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Empowering connections between skilled workers and opportunities
          </p>
        </div>

        {isFeaturesLoading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-6 gap-4">
            <div className="md:col-span-3 p-2">
              <div className="h-64 rounded-lg border p-6 space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-center">
                  <Skeleton className="h-16 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-32 mx-auto" />
              </div>
            </div>
            <div className="md:col-span-3 p-2">
              <div className="h-64 rounded-lg border p-6 space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-center">
                  <Skeleton className="h-16 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-32 mx-auto" />
              </div>
            </div>
            <div className="md:col-span-4 p-2">
              <div className="h-64 rounded-lg border p-6 space-y-4">
                <Skeleton className="h-6 w-36" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-center">
                  <Skeleton className="h-16 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-36 mx-auto" />
              </div>
            </div>
            <div className="md:col-span-2 p-2">
              <div className="h-64 rounded-lg border p-6 space-y-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-center">
                  <Skeleton className="h-16 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-24 mx-auto" />
              </div>
            </div>
            <div className="md:col-span-3 p-2">
              <div className="h-64 rounded-lg border p-6 space-y-4">
                <Skeleton className="h-6 w-28" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
                <div className="flex justify-center">
                  <Skeleton className="h-16 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-32 mx-auto" />
              </div>
            </div>
            <div className="md:col-span-3 p-2">
              <div className="h-64 rounded-lg border p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-center">
                  <Skeleton className="h-16 w-16 rounded-full" />
                </div>
                <Skeleton className="h-5 w-28 mx-auto" />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-6 gap-4">
          {/* Card 1 - Find Work */}
          <div className={cn('p-2 rounded-lg', 'md:col-span-3')}>
            <MainMenusGradientCard
              title="Find Work"
              description="Discover opportunities that match your skills and location preferences with our smart matching system."
              withArrow={true}
              circleSize={300}
            >
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="text-5xl">💼</div>
                <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                  Opportunity Awaits
                </div>
              </div>
            </MainMenusGradientCard>
          </div>

          {/* Card 2 - Get Paid */}
          <div className={cn('p-2 rounded-lg', 'md:col-span-3')}>
            <MainMenusGradientCard
              title="Get Paid"
              description="Secure payments delivered instantly with multiple payment options and transparent pricing."
              withArrow={true}
              circleSize={300}
            >
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="text-5xl">💰</div>
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  Instant Payments
                </div>
              </div>
            </MainMenusGradientCard>
          </div>

          {/* Card 3 - Nearby Connections */}
          <div className={cn('p-2 rounded-lg', 'md:col-span-4')}>
            <MainMenusGradientCard
              title="Nearby Connections"
              description="Connect with workers in your area for quick and efficient hiring with location-based matching."
              withArrow={true}
              circleSize={300}
            >
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="text-5xl">📍</div>
                <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                  Local Network
                </div>
              </div>
            </MainMenusGradientCard>
          </div>

          {/* Card 4 - Smart Search */}
          <div className={cn('p-2 rounded-lg', 'md:col-span-2')}>
            <MainMenusGradientCard
              title="Smart Search"
              description="Advanced location-based matching with AI-powered recommendations for perfect job matches."
              withArrow={true}
              circleSize={300}
            >
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="text-4xl">🔍</div>
                <div className="text-base font-semibold text-orange-600 dark:text-orange-400">
                  AI-Powered
                </div>
              </div>
            </MainMenusGradientCard>
          </div>

          {/* Card 5 - Verified Profiles */}
          <div className={cn('p-2 rounded-lg', 'md:col-span-2')}>
            <MainMenusGradientCard
              title="Verified Profiles"
              description="Work with trusted professionals. Profiles are verified for identity and skills."
              withArrow={true}
              circleSize={300}
            >
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="text-4xl">✅</div>
                <div className="text-base font-semibold text-sky-600 dark:text-sky-400">
                  Trusted & Verified
                </div>
              </div>
            </MainMenusGradientCard>
          </div>

          {/* Card 6 - Trust & Safety */}
          <div className={cn('p-2 rounded-lg', 'md:col-span-4')}>
            <MainMenusGradientCard
              title="Trust & Safety"
              description="Ratings, reviews, and dispute support ensure a safe experience for everyone."
              withArrow={true}
              circleSize={300}
            >
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="text-5xl">🛡️</div>
                <div className="text-lg font-semibold text-teal-600 dark:text-teal-400">
                  Safe & Reliable
                </div>
              </div>
            </MainMenusGradientCard>
          </div>
        </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-light text-gray-900 dark:text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Three simple steps to transform your career
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Scroll Text Animation */}
          <div className="order-2 lg:order-1">
            <ScrollText
              texts={[
                "Create Profile",
                "Showcase Skills", 
                "Find Local Jobs",
                "Apply Instantly",
                "Work & Deliver",
                "Get Paid Fast",
                "Build Reputation",
                "Grow Your Career"
              ]}
              className="h-[400px]"
            />
          </div>

          {/* Right side - Step Cards */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border border-blue-100 dark:border-blue-800/30">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Create Your Professional Profile
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Sign up in minutes and showcase your skills, experience, and availability. 
                  Add photos, certifications, and set your service rates.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border border-purple-100 dark:border-purple-800/30">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Connect with Local Opportunities
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Our smart matching system finds jobs near you that match your skills. 
                  Browse, apply, and negotiate terms directly with customers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border border-green-100 dark:border-green-800/30">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xl font-bold text-white">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Work Smart, Get Paid Instantly
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  Complete your work with confidence. Our secure payment system 
                  ensures you get paid immediately after job completion.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <ShimmerText 
            text="What Workers Say"
            className="text-5xl font-light mb-4"
          />
          <TypewriterEffect
            words={[
              { text: "Real" },
              { text: "stories" },
              { text: "from" },
              { text: "our" },
              { text: "community", className: "text-blue-500 dark:text-blue-400" }
            ]}
            className="text-xl text-gray-600 dark:text-gray-400"
            cursorClassName="bg-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Testimonial 1 */}
          <CardContainer className="inter-var">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[350px] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white mb-4"
              >
                <div className="flex items-center">
                  <span className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</span>
                </div>
              </CardItem>
              
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-4 dark:text-neutral-300 italic"
              >
                "RozgaarSetu changed my life. I found steady work and the payments are always on time."
              </CardItem>
              
              <CardItem translateZ="100" className="w-full mt-6">
                <div className="flex items-center gap-3">
                  <CardItem translateZ="80">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">R</span>
                    </div>
                  </CardItem>
                  <div>
                    <CardItem translateZ="90" as="p" className="text-neutral-600 dark:text-white font-medium">
                      Rajesh Kumar
                    </CardItem>
                    <CardItem translateZ="70" as="p" className="text-neutral-400 dark:text-neutral-400 text-sm">
                      Electrician
                    </CardItem>
                  </div>
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Testimonial 2 */}
          <CardContainer className="inter-var">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[350px] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white mb-4"
              >
                <div className="flex items-center">
                  <span className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</span>
                </div>
              </CardItem>
              
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-4 dark:text-neutral-300 italic"
              >
                "The platform is so easy to use. I can find work near my home and get paid instantly."
              </CardItem>
              
              <CardItem translateZ="100" className="w-full mt-6">
                <div className="flex items-center gap-3">
                  <CardItem translateZ="80">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">P</span>
                    </div>
                  </CardItem>
                  <div>
                    <CardItem translateZ="90" as="p" className="text-neutral-600 dark:text-white font-medium">
                      Priya Sharma
                    </CardItem>
                    <CardItem translateZ="70" as="p" className="text-neutral-400 dark:text-neutral-400 text-sm">
                      Cleaner
                    </CardItem>
                  </div>
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Testimonial 3 */}
          <CardContainer className="inter-var">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[350px] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white mb-4"
              >
                <div className="flex items-center">
                  <span className="text-yellow-500 text-xl">⭐⭐⭐⭐⭐</span>
                </div>
              </CardItem>
              
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-4 dark:text-neutral-300 italic"
              >
                "Great platform for contractors like me. Professional, reliable, and secure payments."
              </CardItem>
              
              <CardItem translateZ="100" className="w-full mt-6">
                <div className="flex items-center gap-3">
                  <CardItem translateZ="80">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">A</span>
                    </div>
                  </CardItem>
                  <div>
                    <CardItem translateZ="90" as="p" className="text-neutral-600 dark:text-white font-medium">
                      Amit Singh
                    </CardItem>
                    <CardItem translateZ="70" as="p" className="text-neutral-400 dark:text-neutral-400 text-sm">
                      Plumber
                    </CardItem>
                  </div>
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>
      </section>

      {/* CTA Section - Apple Design System */}
      <section className="relative overflow-hidden">
        {/* Background with Apple-style gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-900"></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f1f1_1px,transparent_1px),linear-gradient(to_bottom,#f1f1f1_1px,transparent_1px)] bg-[size:6rem_4rem] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] opacity-20"></div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-32">
          <div className="text-center">
            {/* Apple-style overline */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-800/30 mb-8">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Transform Your Future</span>
            </div>

            {/* TypeWriter Enhanced Headline */}
            <div className="mb-8">
              <h2 className="text-6xl md:text-7xl font-thin text-gray-900 dark:text-white mb-2 tracking-tight">
                Ready to
              </h2>
              <TypewriterTitle
                sequences={[
                  { text: "transform your career", deleteAfter: true, pauseAfter: 2000 },
                  { text: "unlock new opportunities", deleteAfter: true, pauseAfter: 2000 },
                  { text: "build your future", deleteAfter: true, pauseAfter: 2000 },
                  { text: "start earning more", deleteAfter: false, pauseAfter: 3000 }
                ]}
                typingSpeed={80}
                startDelay={1000}
                autoLoop={true}
                loopDelay={3000}
              />
            </div>

            {/* Apple-style subtitle */}
            <p className="text-xl md:text-2xl font-light text-gray-600 dark:text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12">
              Join over <span className="font-medium text-gray-900 dark:text-white">10,000+ skilled workers</span> who have already discovered better opportunities and secured their financial future with RozgaarSetu.
            </p>

            {/* Apple-style CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <a 
                href="/onboarding"
                className="group relative inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 no-underline border-none cursor-pointer min-w-[200px]"
              >
                <span className="relative z-10">Start Your Journey</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </a>
              
              <button className="group relative inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg hover:shadow-gray-500/10 cursor-pointer min-w-[200px]">
                <span className="relative z-10">Learn More</span>
                <div className="absolute inset-0 bg-gray-50 dark:bg-gray-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 group inline-flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 ease-out hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg 
            className="w-5 h-5 transform group-hover:-translate-y-0.5 transition-transform duration-200" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </motion.button>
      )}
      
      <StickyFooter />
    </div>
  );
}