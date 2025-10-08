"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, Menu } from "lucide-react"
import ProfileButton from "@/components/profile-button"
import { useState } from "react"

interface CustomerHeaderProps {
  onMenuClick?: () => void
  showMenuButton?: boolean
}

export function CustomerHeader({ onMenuClick, showMenuButton = false }: CustomerHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-black shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {showMenuButton && (
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Good morning! 👋
            </h1>
          </div>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search workers, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-colors"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="relative"
          >
            <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          
          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
          
          <ProfileButton />
        </div>
      </div>
    </header>
  )
}
