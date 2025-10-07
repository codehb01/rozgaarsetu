"use client"

import { usePathname } from "next/navigation"
import Header from "./header"

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Hide header on customer and worker dashboard pages
  const hideHeader = pathname?.startsWith('/customer') || 
                    pathname?.startsWith('/worker')
  
  if (hideHeader) {
    return null
  }
  
  return <Header />
}