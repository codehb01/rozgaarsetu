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
            "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-semibold rounded-2xl py-4 px-6 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
          card: "bg-transparent shadow-none border-0 p-0",
          rootBox: "w-full",
          headerTitle: "text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2",
          headerSubtitle: "text-gray-600 dark:text-gray-300 mb-8 text-lg",
          socialButtonsBlockButton: 
            "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl font-medium py-3 px-4 transition-all duration-200 shadow-sm hover:shadow-md",
          socialButtonsBlockButtonText: "font-medium text-gray-700 dark:text-gray-200",
          formFieldInput: 
            "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-4 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200",
          formFieldLabel: "text-gray-700 dark:text-gray-300 font-medium mb-3 text-sm uppercase tracking-wide",
          footerActionText: "text-gray-500 dark:text-gray-400 text-sm",
          footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
          dividerLine: "bg-gray-200",
          dividerText: "text-gray-400 text-sm font-medium",
          identityPreviewText: "text-gray-600",
          identityPreviewEditButton: "text-blue-600 hover:text-blue-700",
          formResendCodeLink: "text-blue-600 hover:text-blue-700 font-medium",
          otpCodeFieldInput: "border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
          formFieldSuccessText: "text-green-600",
          formFieldErrorText: "text-red-500",
          formFieldHintText: "text-gray-500 text-sm",
          alternativeMethodsBlockButton: "text-blue-600 hover:text-blue-700 font-medium"
        },
        variables: {
          colorPrimary: "#3b82f6",
          colorTextOnPrimaryBackground: "#ffffff",
          borderRadius: "0.75rem",
          spacingUnit: "1rem",
          fontFamily: "inherit"
        },
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "blockButton"
        }
      }}>
      <html lang="en" suppressHydrationWarning>
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
    </ClerkProvider>
  );
}
