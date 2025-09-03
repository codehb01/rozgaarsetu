import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Wrench, ShoppingCart, User } from "lucide-react";
import { checkUser } from "@/lib/checkUser";

const Header = async () => {
  const user = await checkUser(); // includes workerProfile & customerProfile

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <h1 className="font-bold text-lg">RozgaarSetu</h1>
        </Link>

        <div className="flex items-center gap-3">
          <SignedIn>
            {/* Decide CTA based on profile presence */}
            {user?.workerProfile ? (
              <Link href="/worker/dashboard">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition"
                >
                  <Wrench className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Worker Dashboard</span>
                </Button>
                <Button
                  variant="ghost"
                  className="md:hidden w-10 h-10 p-0 rounded-full hover:bg-blue-50"
                  aria-label="Worker Dashboard"
                >
                  <Wrench className="h-5 w-5 text-blue-600" />
                </Button>
              </Link>
            ) : user?.customerProfile ? (
              <Link href="/customer/dashboard">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition"
                >
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Customer Dashboard</span>
                </Button>
                <Button
                  variant="ghost"
                  className="md:hidden w-10 h-10 p-0 rounded-full hover:bg-green-50"
                  aria-label="Customer Dashboard"
                >
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                </Button>
              </Link>
            ) : (
              <Link href="/onboarding">
                <Button
                  variant="outline"
                  className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition"
                >
                  <User className="h-5 w-5 text-amber-500" />
                  <span className="font-medium">Complete Profile</span>
                </Button>
                <Button
                  variant="ghost"
                  className="md:hidden w-10 h-10 p-0 rounded-full hover:bg-amber-50"
                  aria-label="Complete Profile"
                >
                  <User className="h-5 w-5 text-amber-500" />
                </Button>
              </Link>
            )}
          </SignedIn>

          {/* Show Sign In + Sign Up when signed out */}
          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInButton>
                <Button
                  variant="secondary"
                  className="rounded-xl px-4 py-2 font-medium shadow-sm hover:shadow-md transition"
                >
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button
                  variant="default"
                  className="rounded-xl px-4 py-2 font-medium shadow-sm hover:shadow-md transition"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-10 h-10 rounded-full ring-2 ring-offset-2 ring-blue-500",
                  userButtonPopoverCard: "shadow-xl rounded-xl",
                  userPreviewMainIdentifier: "font-semibold text-gray-800",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
