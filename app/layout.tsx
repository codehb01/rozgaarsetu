import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import ConditionalHeader from "@/components/conditional-header";
import { dark } from "@clerk/themes";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "sonner";
import ConditionalFooter from "@/components/conditional-footer";

import { QueryProvider } from "@/components/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RozgaarSetu",
  description: "A platform for blue-collar workers and employers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: undefined,
        elements: {
          formButtonPrimary:
            "bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-3 px-6 transition-colors duration-200 shadow-sm",
          card: "bg-transparent shadow-none border-0 p-0",
          rootBox: "w-full",
          headerTitle: "text-3xl font-semibold text-foreground mb-2 tracking-tight",
          headerSubtitle: "text-muted-foreground mb-8 text-base font-normal",
          socialButtonsBlockButton:
            "bg-card border border-border text-foreground hover:bg-muted rounded-lg font-medium py-3 px-4 transition-colors duration-200",
          socialButtonsBlockButtonText: "font-medium text-foreground",
          formFieldInput:
            "bg-background border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3 text-foreground placeholder-muted-foreground transition-colors duration-200",
          formFieldLabel: "text-foreground font-medium mb-3 text-sm tracking-normal",
          footerActionText: "text-muted-foreground text-sm",
          footerActionLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium",
          dividerLine: "bg-border",
          dividerText: "text-muted-foreground text-sm font-medium",
          identityPreviewText: "text-muted-foreground",
          identityPreviewEditButton: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
          formResendCodeLink: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium",
          otpCodeFieldInput: "border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          formFieldSuccessText: "text-green-600 dark:text-green-400",
          formFieldErrorText: "text-red-500 dark:text-red-400",
          formFieldHintText: "text-muted-foreground text-sm",
          alternativeMethodsBlockButton: "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
        },
        variables: {
          colorPrimary: "#3b82f6",
          colorTextOnPrimaryBackground: "#ffffff",
          borderRadius: "0.5rem",
          spacingUnit: "1rem",
          fontFamily: "inherit"
        },
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "blockButton"
        }
      }}>
      <QueryProvider>
        <html lang="en" suppressHydrationWarning style={{ fontFamily: inter.style.fontFamily }}>
          <body className={`${inter.className}`}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* Header on all pages for UI consistency */}
              <ConditionalHeader />
              <main className="min-h-screen">{children}</main>
              <Toaster richColors />
              {/* Conditional footer - hidden on customer/worker dashboards */}
              <ConditionalFooter />
            </ThemeProvider>
          </body>
        </html>
      </QueryProvider>
    </ClerkProvider>
  );
}
