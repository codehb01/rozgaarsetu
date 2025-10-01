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

// Apple-style navigation items
const navItems = [
  { name: "Home", link: "/" },
  { name: "Find Workers", link: "/workers" },
  { name: "Pricing", link: "/pricing" },
  { name: "About", link: "/about" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  // Apple-style conditional rendering
  const shouldShowNavItems = true;

  return (
    <Navbar className="fixed top-0 inset-x-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-gray-200/20 dark:border-gray-800/20">
      <NavBody>
        {/* Apple-inspired Logo */}
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="relative z-20 flex items-center space-x-3 px-2 py-1.5 text-sm font-normal text-black dark:text-white group"
          >
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-200">
              <span className="text-white font-semibold text-sm">R</span>
            </div>
            <span className="font-semibold text-black dark:text-white tracking-tight">RozgaarSetu</span>
          </Link>
        </div>

        {/* Apple-style Navigation Items */}
        {shouldShowNavItems && (
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className="relative px-4 py-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100/50 dark:hover:bg-gray-800/50 transition-all duration-200 font-medium text-sm"
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}

        {/* Apple-style Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Refined Theme Toggle */}
          {mounted && (
            <button
              aria-label="Toggle theme"
              className="relative h-9 w-9 rounded-full bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 backdrop-blur transition-all duration-200 flex items-center justify-center group"
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            >
              <div className="relative h-4 w-4">
                <Sun
                  className={`absolute top-0 left-0 h-4 w-4 text-amber-500 transition-all duration-300 ease-out ${
                    currentTheme === "dark" 
                      ? "opacity-0 scale-75 rotate-90" 
                      : "opacity-100 scale-100 rotate-0"
                  }`}
                />
                <Moon
                  className={`absolute top-0 left-0 h-4 w-4 text-blue-500 transition-all duration-300 ease-out ${
                    currentTheme === "dark" 
                      ? "opacity-100 scale-100 rotate-0" 
                      : "opacity-0 scale-75 -rotate-90"
                  }`}
                />
              </div>
            </button>
          )}

          <SignedIn>
            <ProfileButton />
          </SignedIn>

          <SignedOut>
            <div className="hidden md:flex items-center space-x-2">
              <SignInButton>
                <NavbarButton 
                  variant="secondary" 
                  className="bg-gray-100/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 border-0 hover:bg-gray-200/80 dark:hover:bg-gray-700/80 backdrop-blur font-medium transition-all duration-200"
                >
                  Sign In
                </NavbarButton>
              </SignInButton>
              <SignUpButton>
                <NavbarButton 
                  variant="primary"
                  className="bg-blue-500 hover:bg-blue-600 text-white border-0 font-medium shadow-sm hover:shadow-md transition-all duration-200"
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
                  userButtonPopoverCard: "shadow-xl rounded-xl backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border border-gray-200/50 dark:border-gray-800/50",
                  userPreviewMainIdentifier: "font-medium text-gray-900 dark:text-gray-100",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          </div>
        </div>
      </NavBody>

      {/* Apple-style Mobile Navigation */}
      <MobileNav visible={true}>
        <MobileNavHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">R</span>
              </div>
              <span className="font-semibold text-black dark:text-white tracking-tight">RozgaarSetu</span>
            </div>
            <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="flex flex-col space-y-1 p-4">
            {/* Mobile Navigation Items */}
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={item.link}
                className="px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="border-t border-gray-200/50 dark:border-gray-800/50 pt-4 mt-4 space-y-1">
              {/* Mobile Theme Toggle */}
              {mounted && (
                <button
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 font-medium"
                  onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                >
                  {currentTheme === "dark" ? (
                    <Sun className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-blue-500" />
                  )}
                  <span>Switch to {currentTheme === "dark" ? "Light" : "Dark"} Mode</span>
                </button>
              )}
              
              <SignedOut>
                <SignInButton>
                  <button className="w-full text-left px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-all duration-200 font-medium">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="w-full bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition-all duration-200 font-medium shadow-sm">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-50/80 dark:bg-gray-800/50">
                  <UserButton />
                  <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">Your Account</span>
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
