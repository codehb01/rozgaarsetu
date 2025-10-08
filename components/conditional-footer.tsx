"use client"

import { usePathname } from "next/navigation"
import Footer from "./footer"

export default function ConditionalFooter() {
  const pathname = usePathname()
  
  // Hide footer on auth pages, customer/worker dashboards, and onboarding
  const hideFooter = pathname?.startsWith('/customer') || 
                    pathname?.startsWith('/worker') ||
                    pathname?.startsWith('/onboarding') ||
                    pathname?.startsWith('/sign-in') ||
                    pathname?.startsWith('/sign-up')
  
  if (hideFooter) {
    return null
  }
  
  return <Footer />
}