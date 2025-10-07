"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProfileButton from "@/components/profile-button"
import React, { Dispatch, SetStateAction, useState, useEffect } from "react"
import { IconType } from "react-icons"
import {
  FiHome,
  FiSearch,
  FiCalendar,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiBell,
  FiX,
  FiChevronsRight,
  FiChevronDown,
  FiSun,
  FiMoon
} from "react-icons/fi"
import { motion } from "framer-motion"
import { useTheme } from "next-themes"
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"

const navigation = [
  {
    name: "Dashboard",
    href: "/customer/dashboard",
    icon: FiHome,
  },
  {
    name: "Find Workers",
    href: "/customer/search",
    icon: FiSearch,
  },
  {
    name: "My Bookings",
    href: "/customer/bookings",
    icon: FiCalendar,
  },
  {
    name: "Profile",
    href: "/customer/profile",
    icon: FiUser,
  },
]

const secondaryNavigation = [
  {
    name: "Settings",
    href: "/customer/settings",
    icon: FiSettings,
  },
  {
    name: "Help",
    href: "/help",
    icon: FiHelpCircle,
  },
]

interface CustomerSidebarProps {
  onMobileClose?: () => void;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const Option = ({
  Icon,
  title,
  href,
  pathname,
  open,
}: {
  Icon: IconType;
  title: string;
  href: string;
  pathname: string;
  open: boolean;
}) => {
  const isActive = pathname === href;
  
  return (
    <Link href={href}>
      <motion.button
        layout
        className={`relative flex h-10 w-full items-center rounded-md transition-colors ${
          isActive 
            ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100" 
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        }`}
        suppressHydrationWarning
      >
        <motion.div
          layout
          className="grid h-full w-10 place-content-center text-lg"
        >
          <Icon />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            {title}
          </motion.span>
        )}
      </motion.button>
    </Link>
  );
};

const ToggleClose = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="w-full border-t border-gray-200 dark:border-gray-700 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
      suppressHydrationWarning
    >
      <div className="flex items-center p-3">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform text-gray-500 dark:text-gray-400 ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium text-gray-500 dark:text-gray-400"
          >
            Collapse
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};

export function CustomerSidebar({ onMobileClose, open = true, setOpen }: CustomerSidebarProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => setMounted(true), [])
  
  const currentTheme = theme === "system" ? systemTheme : theme
  
  // Use internal state only if no external state is provided (for mobile)
  const [internalOpen, setInternalOpen] = useState(true)
  const isOpen = setOpen ? open : internalOpen
  const toggleOpen = setOpen ? ((newOpen: boolean | ((prev: boolean) => boolean)) => {
    if (typeof newOpen === 'function') {
      setOpen(newOpen(open))
    } else {
      setOpen(newOpen)
    }
  }) : setInternalOpen

  return (
    <motion.nav
      layout
      className="fixed left-0 top-0 h-full shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col overflow-hidden z-40"
      style={{
        width: isOpen ? "256px" : "fit-content",
      }}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-3"
          >
            <img 
              src="/hard-hat_11270170.svg" 
              alt="RozgaarSetu Logo" 
              className="w-8 h-8 object-contain filter brightness-0 dark:brightness-100 dark:invert"
            />
            <span className="font-semibold text-gray-900 dark:text-white tracking-tight">RozgaarSetu</span>
          </motion.div>
        ) : (
          <div className="flex justify-center">
            <img 
              src="/hard-hat_11270170.svg" 
              alt="RozgaarSetu Logo" 
              className="w-8 h-8 object-contain filter brightness-0 dark:brightness-100 dark:invert"
            />
          </div>
        )}
      </div>
      {/* Mobile close button */}
      {onMobileClose && (
        <div className="lg:hidden flex justify-end p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileClose}
            className="h-8 w-8 p-0"
          >
            <FiX className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Search Bar */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="mb-4 px-4"
        >
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 transition-colors"
            />
          </div>
        </motion.div>
      )}

      {/* Main Navigation */}
      <div className="flex-1 space-y-1 px-2 mb-4 overflow-hidden">
        {navigation.map((item) => (
          <Option
            key={item.name}
            Icon={item.icon}
            title={item.name}
            href={item.href}
            pathname={pathname}
            open={isOpen}
          />
        ))}
      </div>

      {/* Secondary Navigation */}
      <div className="space-y-1 px-2 border-t border-gray-200 dark:border-gray-700 pt-4 mb-4 overflow-hidden">
        {secondaryNavigation.map((item) => (
          <Option
            key={item.name}
            Icon={item.icon}
            title={item.name}
            href={item.href}
            pathname={pathname}
            open={isOpen}
          />
        ))}
        
        {/* Theme Toggle */}
        {mounted && (
          <motion.button
            layout
            onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
            className="relative flex h-10 w-full items-center rounded-md transition-colors text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <motion.div
              layout
              className="grid h-full w-10 place-content-center text-lg"
            >
              {currentTheme === "dark" ? <FiSun /> : <FiMoon />}
            </motion.div>
            {isOpen && (
              <motion.span
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.125 }}
                className="text-xs font-medium"
              >
                {currentTheme === "dark" ? "Light Mode" : "Dark Mode"}
              </motion.span>
            )}
          </motion.button>
        )}
      </div>

      {/* User Profile Section */}
      <div className="px-2 py-3 border-t border-gray-200 dark:border-gray-700 mb-2">
        <SignedIn>
          {isOpen ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3"
            >
              <div className="flex items-center space-x-3">
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8 rounded-full ring-1 ring-gray-200 dark:ring-gray-700",
                      userButtonPopoverCard: "shadow-xl rounded-xl backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border border-gray-200/50 dark:border-gray-800/50",
                    },
                  }}
                  afterSignOutUrl="/"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    Customer Dashboard
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    Manage your bookings
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <FiBell className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </Button>
              </div>
            </motion.div>
          ) : (
            <div className="flex justify-center">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 rounded-full ring-1 ring-gray-200 dark:ring-gray-700",
                    userButtonPopoverCard: "shadow-xl rounded-xl backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border border-gray-200/50 dark:border-gray-800/50",
                  },
                }}
                afterSignOutUrl="/"
              />
            </div>
          )}
        </SignedIn>
        
        <SignedOut>
          {isOpen ? (
            <div className="space-y-2">
              <SignInButton>
                <Button variant="outline" className="w-full">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <SignInButton>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                  <FiUser className="h-4 w-4" />
                </Button>
              </SignInButton>
            </div>
          )}
        </SignedOut>
      </div>

      {/* Collapse Button - Now at bottom but visible */}
      <ToggleClose open={isOpen} setOpen={toggleOpen} />
    </motion.nav>
  )
}