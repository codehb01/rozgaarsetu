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
            "bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl",
          card: "bg-white shadow-xl rounded-2xl border-0 p-8",
          headerTitle: "text-gray-900 font-semibold text-2xl",
          headerSubtitle: "text-gray-600 mt-2",
          socialButtonsBlockButton: 
            "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md",
          formFieldInput: 
            "bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent px-4 py-3",
          footerActionText: "text-gray-600",
          footerActionLink: "text-blue-600 hover:text-blue-700 font-medium",
          dividerLine: "bg-gray-200",
          dividerText: "text-gray-500 text-sm",
          formFieldLabel: "text-gray-700 font-medium mb-2",
          identityPreviewText: "text-gray-600",
          identityPreviewEditButton: "text-blue-600 hover:text-blue-700"
        },
        variables: {
          colorPrimary: "#2563eb",
          colorTextOnPrimaryBackground: "#ffffff",
          borderRadius: "0.75rem",
          spacingUnit: "1rem"
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
