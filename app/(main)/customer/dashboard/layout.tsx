"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FloatingDock}  from "../../../../components/ui/floating-dock";
import { IconDashboard, IconCalendarEvent, IconUser } from "@tabler/icons-react";

const tabs = [
  { href: "/customer", label: "Dashboard" },
  { href: "/customer/bookings", label: "Bookings" },
  { href: "/customer/profile", label: "Profile" },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  const items = tabs.map((t) => ({
    title: t.label,
    href: t.href,
    icon: t.label === "Dashboard" ? <IconDashboard className="w-6 h-6" /> : 
          t.label === "Bookings" ? <IconCalendarEvent className="w-6 h-6" /> :
          <IconUser className="w-6 h-6" />,
  }));

  return (
  <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-2">
      {children}

      {/* Universal Floating Dock */}
      <FloatingDock />
      
    </div>
  );
}
