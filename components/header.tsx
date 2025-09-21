'use client';

import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { Wrench, ShoppingCart } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "@/lib/language-context";

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <h1 className="font-bold text-lg">RozgaarSetu</h1>
        </Link>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          <SignedIn>
            {/* Simplified buttons - we can enhance these later with user data */}
            <Link href="/worker/dashboard">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition"
              >
                <Wrench className="h-5 w-5 text-blue-600" />
                <span className="font-medium">{t('worker.dashboard')}</span>
              </Button>
            </Link>
            
            <Link href="/customer/dashboard">
              <Button
                variant="outline"
                className="hidden md:inline-flex items-center gap-2 rounded-xl px-4 py-2 shadow-sm hover:shadow-md transition"
              >
                <ShoppingCart className="h-5 w-5 text-green-600" />
                <span className="font-medium">{t('customer.dashboard')}</span>
              </Button>
            </Link>
          </SignedIn>

          {/* Show Sign In + Sign Up when signed out */}
          <SignedOut>
            <div className="flex items-center gap-2">
              <SignInButton>
                <Button
                  variant="secondary"
                  className="rounded-xl px-4 py-2 font-medium shadow-sm hover:shadow-md transition"
                >
                  {t('nav.signIn')}
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button
                  variant="default"
                  className="rounded-xl px-4 py-2 font-medium shadow-sm hover:shadow-md transition"
                >
                  {t('nav.signUp')}
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