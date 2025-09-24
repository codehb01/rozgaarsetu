import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { LanguageProvider } from "@/contexts/language-context";
import { LanguageSelectionDrawer } from "@/components/language-selection-drawer";
import { ThemeProvider } from "@/components/theme-provider";
import { ClientHeroUIProvider } from "@/components/heroui-provider";

import { ResizableNavbar } from "@/components/navbar";

const inter = Inter({ subsets: ["latin"] });

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
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body style={{ fontFamily: inter.style.fontFamily }}>
          <ThemeProvider>
            <ClientHeroUIProvider>
              <LanguageProvider>
                <ResizableNavbar />
                <main style={{ minHeight: '100vh', paddingTop: '6rem' }}>
                  {children}
                </main>

                <LanguageSelectionDrawer />
              </LanguageProvider>
            </ClientHeroUIProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
