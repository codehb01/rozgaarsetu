"use client";

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import {
  Navbar,
  NavBody,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Sun, Moon, Circle } from "lucide-react";
import { Button } from "./ui/button";
import { useUserProfile } from "@/hooks/use-user-profile";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

// Dynamic import for ProfileButton
import dynamic from "next/dynamic";

const ProfileButton = dynamic(() => import("./profile-button"), {
  loading: () => (
    <Button
      variant="outline"
      className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2 opacity-50"
      disabled
    >
      Loading...
    </Button>
  ),
});

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { userProfile, loading, error } = useUserProfile();

  useEffect(() => setMounted(true), []);

  // Log any errors for debugging
  useEffect(() => {
    if (error) {
      console.error("Header: Error loading user profile:", error);
    }
  }, [error]);

  const currentTheme = theme === "system" ? systemTheme : theme;

  // Dynamic navigation items based on user role
  const getNavItems = () => {
    const baseItems = [{ name: "Home", link: "/" }];

    // Add dashboard link only when user is logged in and has a role assigned
    if (userProfile) {
      if (userProfile.role === "WORKER") {
        baseItems.push({ name: "Dashboard", link: "/worker/dashboard" });
      } else if (userProfile.role === "CUSTOMER") {
        baseItems.push({ name: "Dashboard", link: "/customer/dashboard" });
      }
      // Don't add dashboard link for UNASSIGNED role - they should complete onboarding first
    }

    baseItems.push({ name: "Pricing", link: "/pricing" });

    return baseItems;
  };

  const navItems = getNavItems();

  // Apple-style conditional rendering
  const shouldShowNavItems = true;

  return (
    <Navbar className="fixed top-0 inset-x-0 z-50">
      <NavBody className="border-b border-gray-200/20 dark:border-gray-800/20">
        {/* Apple-inspired Logo */}
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="relative z-20 flex items-center space-x-3 px-2 py-1.5 text-sm font-normal text-black dark:text-white group"
          >
            {/* Hard Hat Logo */}
            <img
              src="/hard-hat_11270170.svg"
              alt="RozgaarSetu Logo"
              className="w-8 h-8 object-contain hover:scale-105 transition-transform duration-200 filter brightness-0 dark:brightness-100 dark:invert"
            />
            <span className="font-semibold text-black dark:text-white tracking-tight">
              RozgaarSetu
            </span>
          </Link>
        </div>

        {/* Apple-style Navigation Items */}
        {shouldShowNavItems && (
          <div className="hidden md:flex items-center space-x-1">
            {loading ? (
              // Show loading skeleton for navigation items
              <>
                <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse w-16 h-8"></div>
                <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse w-20 h-8"></div>
                <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse w-16 h-8"></div>
                <div className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse w-14 h-8"></div>
              </>
            ) : (
              navItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  className="relative px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 font-medium text-sm"
                >
                  {item.name}
                </Link>
              ))
            )}
          </div>
        )}

        {/* Apple-style Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Animated Theme Toggler */}
          <AnimatedThemeToggler />

          <SignedIn>
            <ProfileButton />
          </SignedIn>

          <SignedOut>
            <div className="hidden md:flex items-center space-x-2">
              <SignInButton>
                <NavbarButton
                  variant="secondary"
                  className="bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border-0 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 backdrop-blur font-medium transition-all duration-200 rounded-full"
                >
                  Sign In
                </NavbarButton>
              </SignInButton>
              <SignUpButton>
                <NavbarButton
                  variant="primary"
                  className="bg-blue-500 hover:bg-blue-600 text-white border-0 font-medium shadow-sm hover:shadow-md transition-all duration-200 rounded-full"
                >
                  Sign Up
                </NavbarButton>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-9 h-9 rounded-full ring-1 ring-gray-200 dark:ring-gray-700 hover:ring-gray-300 dark:hover:ring-gray-600 transition-all duration-200",
                  userButtonPopoverCard:
                    "shadow-xl rounded-xl backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border border-gray-200/50 dark:border-gray-800/50",
                  userPreviewMainIdentifier:
                    "font-medium text-gray-900 dark:text-gray-100",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <MobileNavToggle
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </div>
      </NavBody>

      {/* Apple-style Mobile Navigation */}
      <MobileNav visible={true}>
        <MobileNavHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              {/* Hard Hat Logo */}
              <img
                src="/hard-hat_11270170.svg"
                alt="RozgaarSetu Logo"
                className="w-8 h-8 object-contain filter brightness-0 dark:brightness-100 dark:invert"
              />
              <span className="font-semibold text-black dark:text-white tracking-tight">
                RozgaarSetu
              </span>
            </div>
            <MobileNavToggle
              isOpen={isOpen}
              onClick={() => setIsOpen(!isOpen)}
            />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="flex flex-col space-y-1 p-4">
            {/* Mobile Navigation Items */}
            {loading ? (
              // Show loading skeleton for mobile navigation
              <>
                <div className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse h-10"></div>
                <div className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse h-10"></div>
                <div className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse h-10"></div>
                <div className="px-4 py-3 rounded-lg bg-gray-100 dark:bg-gray-800 animate-pulse h-10"></div>
              </>
            ) : (
              navItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))
            )}

            <div className="border-t border-gray-200/50 dark:border-gray-800/50 pt-4 mt-4 space-y-1">
              {/* Mobile Theme Toggler */}
              <div className="px-4 py-3">
                <AnimatedThemeToggler />
              </div>

              <SignedOut>
                <SignInButton>
                  <button className="w-full text-left px-4 py-3 rounded-full text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 font-medium">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="w-full bg-blue-500 text-white px-4 py-3 rounded-full hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-50/80 dark:bg-gray-800/50">
                  <UserButton />
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Your Account
                  </span>
                </div>
              </SignedIn>
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
    </Navbar>
  );
}

export default Header;
