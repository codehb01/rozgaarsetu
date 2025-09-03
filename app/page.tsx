import Header from "../components/header";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 overflow-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative mx-auto max-w-6xl px-6 py-20 text-center mt-10 ">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-600/5 to-purple-600/5 rounded-full blur-3xl animate-spin-slow"></div>
        </div>

        <div className="space-y-8 relative z-10">
          <div className="animate-fade-in-up">
            <h1 className="text-6xl md:text-7xl font-light text-white tracking-tight leading-tight">
              Connect. Work.{" "}
              <span className="text-blue-400 animate-pulse">Grow.</span>
            </h1>
          </div>

          <div className="animate-fade-in-up delay-300">
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The modern platform connecting blue-collar workers with
              opportunities.
              <br className="hidden md:block" />
              <span className="text-blue-400 font-medium">
                Simple, secure, and location-smart.
              </span>
            </p>
          </div>

          <div className="animate-fade-in-up delay-500">
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-10 py-4 rounded-full text-lg font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-10 py-4 rounded-full border-2 border-gray-600 text-gray-300 hover:bg-gray-800 hover:border-gray-500 text-lg font-medium transform hover:scale-105 transition-all duration-300"
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="animate-fade-in-up delay-700 pt-16">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-400 animate-count-up">
                  10K+
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  Active Workers
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-green-400 animate-count-up">
                  5K+
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  Jobs Completed
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-purple-400 animate-count-up">
                  95%
                </div>
                <div className="text-gray-400 text-sm md:text-base">
                  Success Rate
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            Why Choose RozgaarSetu?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Empowering connections between skilled workers and opportunities
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="group animate-slide-in-left delay-100">
            <Card className="p-8 bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
                  Find Work
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Discover opportunities that match your skills and location
                  preferences
                </p>
              </div>
            </Card>
          </div>

          <div className="group animate-slide-in-left delay-200">
            <Card className="p-8 bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/10">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-green-400 transition-colors">
                  Get Paid
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Secure payments delivered instantly with multiple payment
                  options
                </p>
              </div>
            </Card>
          </div>

          <div className="group animate-slide-in-right delay-100">
            <Card className="p-8 bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-purple-400 transition-colors">
                  Nearby
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Connect with workers in your area for quick and efficient
                  hiring
                </p>
              </div>
            </Card>
          </div>

          <div className="group animate-slide-in-right delay-200">
            <Card className="p-8 bg-gray-800/50 border-gray-700 hover:bg-gray-800 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/10">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-500">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white group-hover:text-orange-400 transition-colors">
                  Smart Search
                </h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors">
                  Advanced location-based matching with AI-powered
                  recommendations
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-400">
            Three simple steps to get started
          </p>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-center gap-12">
          <div className="flex flex-col items-center text-center max-w-sm animate-fade-in-up delay-100">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <span className="text-2xl font-bold text-white">1</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">
              Create Profile
            </h3>
            <p className="text-gray-400">
              Sign up and create your professional profile with skills and
              experience
            </p>
          </div>

          <div className="hidden lg:block w-24 h-px bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>

          <div className="flex flex-col items-center text-center max-w-sm animate-fade-in-up delay-300">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-6 animate-bounce delay-200">
              <span className="text-2xl font-bold text-white">2</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Find Jobs</h3>
            <p className="text-gray-400">
              Browse and apply to jobs that match your skills and location
            </p>
          </div>

          <div className="hidden lg:block w-24 h-px bg-gradient-to-r from-purple-500 to-green-500 animate-pulse delay-1000"></div>

          <div className="flex flex-col items-center text-center max-w-sm animate-fade-in-up delay-500">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce delay-500">
              <span className="text-2xl font-bold text-white">3</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Get Paid</h3>
            <p className="text-gray-400">
              Complete work and receive secure payments instantly
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            What Workers Say
          </h2>
          <p className="text-xl text-gray-400">
            Real stories from our community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-8 bg-gray-800/50 border-gray-700 animate-slide-in-up delay-100 hover:bg-gray-800 transition-all duration-500">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 italic">
                &quot;RozgaarSetu changed my life. I found steady work and the
                payments are always on time.&quot;
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">R</span>
                </div>
                <div>
                  <p className="text-white font-medium">Rajesh Kumar</p>
                  <p className="text-gray-400 text-sm">Electrician</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-gray-800/50 border-gray-700 animate-slide-in-up delay-300 hover:bg-gray-800 transition-all duration-500">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 italic">
                &quot;The platform is so easy to use. I can find work near my
                home and get paid instantly.&quot;
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">P</span>
                </div>
                <div>
                  <p className="text-white font-medium">Priya Sharma</p>
                  <p className="text-gray-400 text-sm">Cleaner</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 bg-gray-800/50 border-gray-700 animate-slide-in-up delay-500 hover:bg-gray-800 transition-all duration-500">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-300 italic">
                &quot;Great platform for contractors like me. Professional,
                reliable, and secure payments.&quot;
              </p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">A</span>
                </div>
                <div>
                  <p className="text-white font-medium">Amit Singh</p>
                  <p className="text-gray-400 text-sm">Plumber</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-3xl blur-3xl"></div>
        <div className="relative z-10 space-y-8 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-light text-white">
            Ready to transform your career?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of workers already using RozgaarSetu to find better
            opportunities and secure their future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-12 py-4 rounded-full text-lg font-medium transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-blue-500/25"
            >
              Start Today
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
