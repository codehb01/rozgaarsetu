"use client";

import React, { ReactElement, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";

const DELAY_IN_MS = 2500;
const TRANSITION_DURATION_IN_SECS = 1.5;

export const LogoOrigami = ({ items }: { items: ReactElement[] }) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIndex((pv) => pv + 1);
    }, DELAY_IN_MS);

    return () => {
      clearInterval(intervalRef.current || undefined);
    };
  }, []);

  return (
    <div
      style={{
        transform: "rotateY(-20deg)",
        transformStyle: "preserve-3d",
      }}
      className="relative z-0 h-32 w-48 shrink-0 rounded-xl border border-neutral-700 bg-neutral-800 shadow-lg"
    >
      <AnimatePresence mode="sync">
        <motion.div
          style={{
            y: "-50%",
            x: "-50%",
            clipPath: "polygon(0 0, 100% 0, 100% 50%, 0 50%)",
            zIndex: -index,
            backfaceVisibility: "hidden",
          }}
          key={index}
          transition={{
            duration: TRANSITION_DURATION_IN_SECS,
            ease: "easeInOut",
          }}
          initial={{ rotateX: "0deg" }}
          animate={{ rotateX: "0deg" }}
          exit={{ rotateX: "-180deg" }}
          className="absolute left-1/2 top-1/2"
        >
          {items[index % items.length]}
        </motion.div>
        <motion.div
          style={{
            y: "-50%",
            x: "-50%",
            clipPath: "polygon(0 50%, 100% 50%, 100% 100%, 0 100%)",
            zIndex: index,
            backfaceVisibility: "hidden",
          }}
          key={(index + 1) * 2}
          initial={{ rotateX: "180deg" }}
          animate={{ rotateX: "0deg" }}
          exit={{ rotateX: "0deg" }}
          transition={{
            duration: TRANSITION_DURATION_IN_SECS,
            ease: "easeInOut",
          }}
          className="absolute left-1/2 top-1/2"
        >
          {items[index % items.length]}
        </motion.div>
      </AnimatePresence>

      <hr
        style={{
          transform: "translateZ(1px)",
        }}
        className="absolute left-0 right-0 top-1/2 z-[999999999] -translate-y-1/2 border-t-2 border-neutral-800"
      />
    </div>
  );
};

export const LogoItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={twMerge(
        "grid h-28 w-44 place-content-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-4xl text-white shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
};

// Work Category Component for RozgaarSetu
export const WorkCategoryOrigami = () => {
  const workCategories = [
    <LogoItem key={1} className="bg-orange-300 text-neutral-900">
      <div className="flex flex-col justify-between h-full py-2">
        <div className="flex-1 flex items-center justify-center">
          <svg className="w-8 h-8 fill-current text-black" viewBox="0 0 24 24">
            <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4zM6.7 8.8c-.7.7-1.9.7-2.6 0-.7-.7-.7-1.9 0-2.6.7-.7 1.9-.7 2.6 0 .7.7.7 1.9 0 2.6z"/>
          </svg>
        </div>
        <div className="text-center">
          <span className="text-xs font-medium">Plumber</span>
        </div>
      </div>
    </LogoItem>,
    <LogoItem key={2} className="bg-green-300 text-neutral-900">
      <div className="flex flex-col justify-between h-full py-2">
        <div className="flex-1 flex items-center justify-center">
          <svg className="w-8 h-8 fill-current text-black" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
        <div className="text-center">
          <span className="text-xs font-medium">Electrician</span>
        </div>
      </div>
    </LogoItem>,
    <LogoItem key={3} className="bg-blue-300 text-neutral-900">
      <div className="flex flex-col justify-between h-full py-2">
        <div className="flex-1 flex items-center justify-center">
          <svg className="w-8 h-8 fill-current text-black" viewBox="0 0 24 24">
            <path d="M13.78 15.3L19.78 21.3C20.45 22 21.54 22 22.22 21.3C22.9 20.62 22.9 19.54 22.22 18.85L16.22 12.85C17.5 11.13 18 8.91 17.41 6.83C16.74 4.46 14.76 2.73 12.32 2.3C9.85 1.87 7.37 2.91 5.84 4.79C4.32 6.67 4.05 9.32 5.16 11.5C5.27 11.7 5.46 11.85 5.69 11.9C5.92 11.95 6.15 11.9 6.33 11.78L8.77 10.14C9.35 9.74 9.35 8.87 8.77 8.47L7.5 7.5C8.28 6.5 9.5 5.96 10.78 6C12.06 6.04 13.25 6.68 13.96 7.72L12.22 9.46C11.54 10.14 11.54 11.22 12.22 11.9C12.9 12.58 13.98 12.58 14.66 11.9L16.4 10.16C16.74 11.13 16.74 12.17 16.4 13.14L13.78 15.3Z"/>
          </svg>
        </div>
        <div className="text-center">
          <span className="text-xs font-medium">Carpenter</span>
        </div>
      </div>
    </LogoItem>,
    <LogoItem key={4} className="bg-white text-black">
      <div className="flex flex-col justify-between h-full py-2">
        <div className="flex-1 flex items-center justify-center">
          <svg className="w-8 h-8 fill-current text-black" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
        </div>
        <div className="text-center">
          <span className="text-xs font-medium">Home Services</span>
        </div>
      </div>
    </LogoItem>,
    <LogoItem key={5} className="bg-purple-300 text-neutral-900">
      <div className="flex flex-col justify-between h-full py-2">
        <div className="flex-1 flex items-center justify-center">
          <svg className="w-8 h-8 fill-current text-black" viewBox="0 0 24 24">
            <path d="M12 2l2 7h7l-6 4.5 2 7L12 16l-5 4.5 2-7L3 9h7l2-7z"/>
          </svg>
        </div>
        <div className="text-center">
          <span className="text-xs font-medium">Construction</span>
        </div>
      </div>
    </LogoItem>,
    <LogoItem key={6} className="bg-red-300 text-neutral-900">
      <div className="flex flex-col justify-between h-full py-2">
        <div className="flex-1 flex items-center justify-center">
          <svg className="w-8 h-8 fill-current text-black" viewBox="0 0 24 24">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
        </div>
        <div className="text-center">
          <span className="text-xs font-medium">Auto Repair</span>
        </div>
      </div>
    </LogoItem>,
  ];

  return <LogoOrigami items={workCategories} />;
};