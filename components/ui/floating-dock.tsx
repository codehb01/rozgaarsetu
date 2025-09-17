"use client";

/**
 * Floating Dock Component
 * - Desktop: fixed at bottom center
 * - Mobile: fixed at bottom right (expandable) — aligned to the menu button
 */

import { cn } from "@/lib/utils";
import {
  IconLayoutNavbarCollapse,
  IconHome,
  IconCalendarEvent,
  IconSearch,
  IconMessageCircle,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { useRef, useState } from "react";

// ----------------------------------
// MAIN DOCK WRAPPER
// ----------------------------------
export const FloatingDock = ({
  desktopClassName,
  mobileClassName,
}: {
  desktopClassName?: string;
  mobileClassName?: string;
}) => {
  const dockItems = [
    {
      title: "Home",
      icon: <IconHome className="w-6 h-6" />,
      href: "/customer/dashboard",
    },
    {
      title: "Booking",
      icon: <IconCalendarEvent className="w-6 h-6" />,
      href: "/customer/dashboard/booking",
    },
    {
      title: "Search",
      icon: <IconSearch className="w-6 h-6" />,
      href: "/customer/dashboard/search",
    },
    {
      title: "Reviews",
      icon: <IconMessageCircle className="w-6 h-6" />,
      href: "/customer/dashboard/reviews",
    },
  ];

  return (
    <>
      <FloatingDockDesktop
        items={dockItems}
        className={cn(
          "fixed bottom-4 left-1/2 -translate-x-1/2 z-50",
          desktopClassName
        )}
      />
      <FloatingDockMobile
        items={dockItems}
        className={cn("fixed bottom-4 right-4 z-50", mobileClassName)}
      />
    </>
  );
};

// ----------------------------------
// MOBILE DOCK
// ----------------------------------
const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);

  return (
    // className contains the positioning (e.g. "fixed bottom-4 right-4 z-50")
    // we only add md:hidden here so desktop variant remains unaffected
    <div className={cn("md:hidden", className)}>
      {/* layout container aligns children to the right edge (so menu sits above the button) */}
      <div className="flex flex-col items-end gap-2">
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="mobile-menu"
              // animate from/towards the bottom-right of this element
              initial={{ opacity: 0, scale: 0.92, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 10 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              style={{ transformOrigin: "right bottom" }}
              className="rounded-2xl bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md p-3 shadow-lg"
            >
              <div className="flex flex-col items-center gap-3">
                {items.map((item, idx) => (
                  <motion.a
                    key={item.title}
                    href={item.href}
                    // bouncy tap (touch) feedback
                    whileTap={{ scale: 0.92 }}
                    // close menu when a button is tapped
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                      delay: idx * 0.03,
                    }}
                    className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800 shadow-md"
                    aria-label={item.title}
                  >
                    <div className="h-6 w-6 text-neutral-700 dark:text-neutral-300">
                      {item.icon}
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle button — same size & style as menu buttons */}
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
// DESKTOP DOCK (unchanged)
// ----------------------------------
const FloatingDockDesktop = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  let mouseX = useMotionValue(Infinity);
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
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

// ----------------------------------
// ICON CONTAINER (unchanged)
// ----------------------------------
function IconContainer({
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
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let heightTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);

  let widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  let heightTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);

  let width = useSpring(widthTransform, { mass: 0.1, stiffness: 150, damping: 12 });
  let height = useSpring(heightTransform, { mass: 0.1, stiffness: 150, damping: 12 });

  let widthIcon = useSpring(widthTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });
  let heightIcon = useSpring(heightTransformIcon, { mass: 0.1, stiffness: 150, damping: 12 });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href}>
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
    </a>
  );
}

