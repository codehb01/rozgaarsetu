"use client"

import { usePathname } from "next/navigation"
import Header from "./header"

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Hide header on customer dashboard pages
  const hideHeader = pathname?.startsWith('/customer') || 
                    pathname?.startsWith('/worker') ||
                    pathname?.startsWith('/onboarding')
  
  if (hideHeader) {
    return null
  }
  
  return <Header />
}