"use client";

import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { LanguageSelectionDrawer } from "@/components/language-selection-drawer";
import NavbarSearch from "@/components/ui/navbar-search";

const navItems = [
  { name: "Home", link: "/" },
  { name: "Find Workers", link: "/workers" },
  { name: "Pricing", link: "/pricing" },
  { name: "About", link: "/about" },
];

export function ResizableNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLanguageDrawerOpen, setIsLanguageDrawerOpen] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case 'hi': return '🇮🇳';
      case 'mr': return '🇮🇳';
      default: return '🇺🇸';
    }
  };

  const getLanguageLabel = (lang: string) => {
    switch (lang) {
      case 'hi': return 'हिंदी';
      case 'mr': return 'मराठी';
      default: return 'English';
    }
  };

  return (
    <Navbar className="fixed top-0 inset-x-0 z-50">
      <NavBody>
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <a
            href="/"
            className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black dark:text-white"
          >
            <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-bold text-black dark:text-white">RozgaarSetu</span>
          </a>
        </div>

        {/* Search Bar - Urban Company Style */}
        <div className="hidden md:block flex-1 max-w-2xl">
          <NavbarSearch placeholder="Search for services" showLocation={true} />
        </div>

        {/* Theme Toggle + Authentication Buttons */}
        <div className="flex items-center space-x-2">
          {/* Theme toggle */}
          {mounted && (
            <button
              aria-label="Toggle theme"
              className="relative h-10 w-10 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/70 backdrop-blur hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center overflow-hidden"
              onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            >
              {/* Container for icons with proper positioning */}
              <div className="relative h-5 w-5">
                {/* Sun Icon */}
                <Sun
                  className={`absolute top-0 left-0 h-5 w-5 text-amber-500 transition-all duration-500 ease-in-out ${
                    currentTheme === "dark" 
                      ? "opacity-0 scale-0 rotate-90" 
                      : "opacity-100 scale-100 rotate-0"
                  }`}
                />
                {/* Moon Icon */}
                <Moon
                  className={`absolute top-0 left-0 h-5 w-5 text-blue-400 transition-all duration-500 ease-in-out ${
                    currentTheme === "dark" 
                      ? "opacity-100 scale-100 rotate-0" 
                      : "opacity-0 scale-0 -rotate-90"
                  }`}
                />
              </div>
              <span className="sr-only">Toggle dark mode</span>
            </button>
          )}

          {/* Language toggle */}
          {mounted && (
            <button
              aria-label="Change language"
              className="relative px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/70 backdrop-blur hover:shadow-md transition-all flex items-center justify-center group hover:scale-105 active:scale-95"
              onClick={() => setIsLanguageDrawerOpen(true)}
            >
              <div className="flex items-center space-x-1.5">
                <span className="text-sm">{getLanguageFlag(language)}</span>
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white transition-colors">
                  {getLanguageLabel(language)}
                </span>
              </div>
              <span className="sr-only">Change language</span>
            </button>
          )}

          <SignedOut>
            <SignInButton>
              <NavbarButton variant="secondary" className="text-black dark:text-white">
                Sign In
              </NavbarButton>
            </SignInButton>
            <SignUpButton>
              <NavbarButton variant="primary">
                Sign Up
              </NavbarButton>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </NavBody>

      {/* Mobile Navigation */}
      <MobileNav visible={true}>
        <MobileNavHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-bold text-black dark:text-white">RozgaarSetu</span>
            </div>
            <MobileNavToggle isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          </div>
        </MobileNavHeader>

        <MobileNavMenu isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <div className="flex flex-col space-y-4">
            {/* Mobile Search */}
            <div className="md:hidden">
              <NavbarSearch placeholder="Search for services" showLocation={true} />
            </div>
            
            {navItems.map((item, idx) => (
              <a
                key={idx}
                href={item.link}
                className="text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            <div className="border-t pt-4 flex flex-col space-y-2">
              {/* Mobile Theme Toggle */}
              {mounted && (
                <button
                  className="flex items-center space-x-3 text-left text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors py-2"
                  onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                >
                  {currentTheme === "dark" ? (
                    <Sun className="h-5 w-5 text-amber-500" />
                  ) : (
                    <Moon className="h-5 w-5 text-blue-400" />
                  )}
                  <span>Switch to {currentTheme === "dark" ? "Light" : "Dark"} Mode</span>
                </button>
              )}

              {/* Mobile Language Toggle */}
              {mounted && (
                <button
                  className="flex items-center space-x-3 text-left text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors py-2"
                  onClick={() => {
                    setIsLanguageDrawerOpen(true);
                    setIsOpen(false);
                  }}
                >
                  <Globe className="h-5 w-5 text-blue-500" />
                  <span>Change Language ({getLanguageFlag(language)} {getLanguageLabel(language)})</span>
                </button>
              )}
              
              <SignedOut>
                <SignInButton>
                  <button className="text-left text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton>
                  <button className="text-left bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center space-x-2">
                  <UserButton />
                  <span className="text-sm text-neutral-600 dark:text-neutral-300">Your Account</span>
                </div>
              </SignedIn>
            </div>
          </div>
        </MobileNavMenu>
      </MobileNav>
      
      {/* Language Selection Drawer */}
      <LanguageSelectionDrawer 
        isOpen={isLanguageDrawerOpen} 
        onClose={() => setIsLanguageDrawerOpen(false)} 
      />
    </Navbar>
  );
}