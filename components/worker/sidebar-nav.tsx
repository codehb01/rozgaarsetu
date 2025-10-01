"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import ProfileButton from "@/components/profile-button"
import React, { Dispatch, SetStateAction, useState } from "react"
import { IconType } from "react-icons"
import {
  FiHome,
  FiBriefcase,
  FiDollarSign,
  FiUser,
  FiSettings,
  FiHelpCircle,
  FiBell,
  FiX,
  FiChevronsRight,
  FiChevronDown,
  FiSearch
} from "react-icons/fi"
import { motion } from "framer-motion"

const navigation = [
  {
    name: "Dashboard",
    href: "/worker/dashboard",
    icon: FiHome,
  },
  {
    name: "My Jobs",
    href: "/worker/job",
    icon: FiBriefcase,
  },
  {
    name: "Earnings",
    href: "/worker/earnings",
    icon: FiDollarSign,
  },
  {
    name: "Profile",
    href: "/worker/profile",
    icon: FiUser,
  },
]

const secondaryNavigation = [
  {
    name: "Settings",
    href: "/worker/settings",
    icon: FiSettings,
  },
  {
    name: "Help & Support",
    href: "/worker/help",
    icon: FiHelpCircle,
  },
]

interface WorkerSidebarProps {
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
        className={cn(
          "relative flex w-full items-center gap-3 rounded-lg p-3 text-left transition-all hover:bg-gray-100 dark:hover:bg-gray-800",
          isActive && "bg-gray-100 dark:bg-gray-800"
        )}
      >
        <motion.div
          layout
          className="grid size-10 place-content-center"
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

export function WorkerSidebar({ onMobileClose, open = true, setOpen }: WorkerSidebarProps) {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  
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
      className="fixed left-0 top-16 h-full shrink-0 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-2 flex flex-col overflow-hidden z-40"
      style={{
        width: isOpen ? "256px" : "fit-content",
        height: "calc(100vh - 4rem)", // Account for navbar height
      }}
    >
      {/* Mobile close button */}
      {onMobileClose && (
        <div className="lg:hidden flex justify-end mb-2">
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
          className="mb-4 px-2"
        >
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>
        </motion.div>
      )}

      {/* Navigation */}
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
      </div>

      {/* Profile Section */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="px-2 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg mb-2"
        >
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <FiUser className="h-4 w-4 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                Welcome back!
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                Worker
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
      )}

      {/* Collapse Button - Now at bottom but visible */}
      <ToggleClose open={isOpen} setOpen={toggleOpen} />
    </motion.nav>
  )
}