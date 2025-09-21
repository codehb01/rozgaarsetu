import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { LanguageProvider } from "@/contexts/language-context";
import { LanguageSelectionDrawer } from "@/components/language-selection-drawer";

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
      <html lang="en">
        <body style={{ fontFamily: inter.style.fontFamily }}>
          <LanguageProvider>
            {/* Simple Header */}
          <header style={{ 
            backgroundColor: 'white', 
            borderBottom: '1px solid #e5e7eb', 
            padding: '1rem 0',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50
          }}>
            <div style={{ 
              maxWidth: '72rem', 
              margin: '0 auto', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '0 1.5rem'
            }}>
              <a href="/" style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#2563eb',
                textDecoration: 'none'
              }}>
                RozgaarSetu
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <SignedOut>
                  <SignInButton>
                    <button style={{
                      backgroundColor: 'transparent',
                      color: '#374151',
                      padding: '0.5rem 1rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      cursor: 'pointer'
                    }}>
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton>
                    <button style={{
                      backgroundColor: '#2563eb',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer'
                    }}>
                      Sign Up
                    </button>
                  </SignUpButton>
                </SignedOut>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </div>
            </div>
          </header>

          <main style={{ minHeight: '100vh', paddingTop: '5rem' }}>
            {children}
          </main>

          {/* Simple Footer */}
          <footer style={{ 
            borderTop: '1px solid #e5e7eb', 
            marginTop: '5rem',
            backgroundColor: '#f9fafb'
          }}>
            <div style={{ 
              maxWidth: '72rem', 
              margin: '0 auto', 
              padding: '3rem 1.5rem'
            }}>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                gap: '2rem'
              }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', marginBottom: '1rem' }}>
                    RozgaarSetu
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    Connecting blue-collar workers with opportunities across India.
                  </p>
                </div>
                <div>
                  <h4 style={{ color: '#111827', fontWeight: '500', marginBottom: '1rem' }}>Platform</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <a href="#" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
                        Find Jobs
                      </a>
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <a href="#" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
                        Post Jobs
                      </a>
                    </li>
                    <li>
                      <a href="#" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
                        How it Works
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: '#111827', fontWeight: '500', marginBottom: '1rem' }}>Support</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <a href="#" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
                        Help Center
                      </a>
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <a href="#" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
                        Contact Us
                      </a>
                    </li>
                    <li>
                      <a href="#" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
                        Terms of Service
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ color: '#111827', fontWeight: '500', marginBottom: '1rem' }}>Connect</h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <a href="#" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
                        Twitter
                      </a>
                    </li>
                    <li style={{ marginBottom: '0.5rem' }}>
                      <a href="#" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
                        LinkedIn
                      </a>
                    </li>
                    <li>
                      <a href="#" style={{ color: '#6b7280', fontSize: '0.875rem', textDecoration: 'none' }}>
                        Instagram
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div style={{ 
                borderTop: '1px solid #e5e7eb', 
                marginTop: '2rem', 
                paddingTop: '2rem', 
                textAlign: 'center'
              }}>
                <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  © 2024 RozgaarSetu. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
          
          <LanguageSelectionDrawer />
          </LanguageProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
