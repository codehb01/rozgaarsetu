"use client";

import { useState } from "react";
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
import { checkUser } from "../lib/checkUser";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavMenu,
  MobileNavToggle,
  NavbarButton,
} from "./ui/resizable-navbar";
import { useEffect } from "react";

interface ResizableHeaderProps {
  user?: {
    id: string;
    role: "CUSTOMER" | "WORKER" | "UNASSIGNED";
    workerProfile?: any;
    customerProfile?: any;
  } | null;
}

const ResizableHeader = ({ user }: ResizableHeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return [];
    
    if (user.workerProfile) {
      return [
        { name: "Dashboard", link: "/worker/dashboard" },
        { name: "Jobs", link: "/worker/jobs" },
        { name: "Earnings", link: "/worker/earnings" },
        { name: "Profile", link: "/worker/profile" },
        { name: "Reviews", link: "/worker/reviews" },
      ];
    } else if (user.customerProfile) {
      return [
        { name: "Dashboard", link: "/customer/dashboard" },
        { name: "Search Workers", link: "/customer/search" },
        { name: "Bookings", link: "/customer/bookings" },
        { name: "Profile", link: "/customer/profile" },
      ];
    }
    return [];
  };

  const navItems = getNavigationItems();

  // Get the appropriate dashboard button based on user profile
  const getDashboardButton = () => {
    if (user?.workerProfile) {
      return {
        href: "/worker/dashboard",
        icon: <Wrench className="h-5 w-5 text-blue-600" />,
        text: "Worker Dashboard",
        color: "blue",
      };
    } else if (user?.customerProfile) {
      return {
        href: "/customer/dashboard",
        icon: <ShoppingCart className="h-5 w-5 text-green-600" />,
        text: "Customer Dashboard",
        color: "green",
      };
    } else {
      return {
        href: "/onboarding",
        icon: <User className="h-5 w-5 text-amber-500" />,
        text: "Complete Profile",
        color: "amber",
      };
    }
  };

  const dashboardButton = getDashboardButton();

  return (
    <div className="fixed top-0 w-full z-50">
      <Navbar className="top-0">
        {/* Desktop Navigation */}
        <NavBody>
          {/* Logo */}
          <Link href="/" className="relative z-20 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black dark:text-white">
            <span className="font-bold text-lg text-black dark:text-white">RozgaarSetu</span>
          </Link>

          {/* Navigation Items */}
          {navItems.length > 0 && (
            <NavItems 
              items={navItems} 
              onItemClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            <SignedIn>
              {/* Dashboard Button */}
              <Link href={dashboardButton.href}>
                <NavbarButton
                  variant="primary"
                  className="hidden md:inline-flex items-center gap-2 px-4 py-2 shadow-sm hover:shadow-md transition"
                >
                  {dashboardButton.icon}
                  <span className="font-medium">{dashboardButton.text}</span>
                </NavbarButton>
              </Link>

              {/* User Button */}
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

            <SignedOut>
              <div className="flex items-center gap-2">
                <SignInButton>
                  <NavbarButton variant="secondary">
                    Sign In
                  </NavbarButton>
                </SignInButton>

                <SignUpButton>
                  <NavbarButton variant="primary">
                    Sign Up
                  </NavbarButton>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            {/* Mobile Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="font-bold text-lg text-black dark:text-white">RozgaarSetu</span>
            </Link>

            <div className="flex items-center gap-2">
              <SignedIn>
                {/* Mobile Dashboard Button */}
                <Link href={dashboardButton.href}>
                  <Button
                    variant="ghost"
                    className="md:hidden w-10 h-10 p-0 rounded-full hover:bg-blue-50"
                    aria-label={dashboardButton.text}
                  >
                    {dashboardButton.icon}
                  </Button>
                </Link>

                {/* Mobile User Button */}
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox:
                        "w-8 h-8 rounded-full ring-2 ring-offset-2 ring-blue-500",
                    },
                  }}
                  afterSignOutUrl="/"
                />
              </SignedIn>

              <SignedOut>
                <div className="flex items-center gap-1">
                  <SignInButton>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-xs px-2 py-1"
                    >
                      Sign In
                    </Button>
                  </SignInButton>

                  <SignUpButton>
                    <Button
                      variant="default"
                      size="sm"
                      className="text-xs px-2 py-1"
                    >
                      Sign Up
                    </Button>
                  </SignUpButton>
                </div>
              </SignedOut>

              {/* Mobile Menu Toggle - only show if user has navigation items */}
              {navItems.length > 0 && (
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              )}
            </div>
          </MobileNavHeader>

          {/* Mobile Menu */}
          {navItems.length > 0 && (
            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md dark:text-gray-300 dark:hover:bg-gray-800"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </MobileNavMenu>
          )}
        </MobileNav>
      </Navbar>
    </div>
  );
};

export default ResizableHeader;