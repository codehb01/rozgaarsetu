import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
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

const Header = () => {
  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <h1 className="font-bold text-lg">RozgaarSetu</h1>
        </Link>

        <div className="flex items-center gap-3">
          <SignedIn>
            <ProfileButton />
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
