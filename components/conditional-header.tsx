"use client"

import { usePathname } from "next/navigation"
import Header from "./header"

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Hide header on customer dashboard pages and auth pages
  const hideHeader = pathname?.startsWith('/customer') || 
                    pathname?.startsWith('/worker') ||
                    pathname?.startsWith('/onboarding') ||
                    pathname?.startsWith('/sign-in') ||
                    pathname?.startsWith('/sign-up')
  
  if (hideHeader) {
    return null
  }
  
  return <Header />
}