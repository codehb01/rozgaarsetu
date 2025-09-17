"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  IconLayoutNavbarCollapse,
  IconHome,
  IconBriefcase,
  IconCurrencyDollar,
  IconUser,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion"; // Corrected import from "motion/react" to "framer-motion"

import { useRef, useState } from "react";

// ----------------------------------
// WORKER-SPECIFIC DOCK ITEMS
// ----------------------------------
const workerDockItems = [
  {
    title: "Dashboard",
    icon: <IconHome className="w-6 h-6" />,
    href: "/worker",
  },
  {
    title: "Jobs",
    icon: <IconBriefcase className="w-6 h-6" />,
    href: "/worker/jobs",
  },
  {
    title: "Earnings",
    icon: <IconCurrencyDollar className="w-6 h-6" />,
    href: "/worker/earnings",
  },
  {
    title: "Profile",
    icon: <IconUser className="w-6 h-6" />,
    href: "/worker/profile",
  },
];

// ----------------------------------
// MAIN WORKER DOCK WRAPPER
// ----------------------------------
const WorkerFloatingDock = ({
  desktopClassName,
  mobileClassName,
}: {
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  return (
    <>
      <WorkerFloatingDockDesktop
        items={workerDockItems}
        className={cn(
          "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
          desktopClassName
        )}
      />
      <WorkerFloatingDockMobile
        items={workerDockItems}
        className={cn("fixed bottom-4 right-4 z-50", mobileClassName)}
      />
    </>
  );
};

// ----------------------------------
// MOBILE WORKER DOCK
// ----------------------------------
const WorkerFloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={cn("md:hidden", className)}>
      <div className="flex flex-col items-end gap-2">
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              style={{ transformOrigin: "right bottom" }}
              className="rounded-2xl bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md p-3 shadow-lg"
            >
              <div className="flex flex-col items-center gap-3">
                {items.map((item, idx) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      delay: idx * 0.03,
                    }}
                  >
                    <motion.div whileTap={{ scale: 0.92 }}>
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 shadow-md"
                        aria-label={item.title}
                      >
                        <div className="h-6 w-6 text-neutral-700 dark:text-neutral-300">
                          {item.icon}
                        </div>
                      </Link>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setOpen((s) => !s)}
          whileTap={{ scale: 0.95 }}
          className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 shadow-md"
          aria-label="Open menu"
        >
          <IconLayoutNavbarCollapse className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
        </motion.button>
      </div>
    </div>
  );
};

// ----------------------------------
// DESKTOP WORKER DOCK
// ----------------------------------
const WorkerFloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-gray-50 px-4 pb-3 md:flex dark:bg-neutral-900 shadow-lg",
        className
      )}
    >
      {items.map((item) => (
        <WorkerIconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

// ----------------------------------
// WORKER ICON CONTAINER
// ----------------------------------
function WorkerIconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  const heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  const widthIcon = useSpring(widthTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });
  const heightIcon = useSpring(heightTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  return (
    <Link href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -top-8 left-1/2 w-fit whitespace-pre rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs text-neutral-700 dark:border-neutral-900 dark:bg-neutral-800 dark:text-white"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center text-neutral-700 dark:text-neutral-300"
        >
          {icon}
        </motion.div>
      </motion.div>
    </Link>
  );
}

interface WorkerLayoutProps {
  children: ReactNode;
}

export default function WorkerLayout({ children }: WorkerLayoutProps) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-24 pt-2">
      {children}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-center pb-4">
        <WorkerFloatingDock desktopClassName="mx-auto mb-4" mobileClassName="translate-y-6" />
      </div>
    </div>
  );
}