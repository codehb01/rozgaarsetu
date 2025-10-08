"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import Link from "next/link";
import BookWorkerButton from "@/components/book-worker-button";

type WorkerLite = {
  id: string;
  name?: string | null;
  role?: string;
  workerProfile?: {
    skilledIn?: string[] | null;
    city?: string | null;
    yearsExperience?: number | null;
    profilePic?: string | null;
    bio?: string | null;
  } | null;
  distanceKm?: number | null;
};

export default function ExpandableCardsWorkers({
  workers,
}: {
  workers: WorkerLite[];
}) {
  const [active, setActive] = useState<string | null>(null);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActive(null);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useOutsideClick(ref as React.RefObject<HTMLElement>, () => setActive(null));

  return (
    <ul className="w-full grid gap-4">
      {workers.map((w) => {
        const name = w.name ?? "Professional";
        const initial = name.charAt(0);
        const skills =
          w.workerProfile?.skilledIn && w.workerProfile!.skilledIn!.length > 0
            ? w.workerProfile!.skilledIn!.slice(0, 3).join(", ")
            : "No skills listed";
        const distance =
          typeof w.distanceKm === "number"
            ? w.distanceKm < 1
              ? `${Math.round(w.distanceKm * 1000)} m`
              : `${w.distanceKm.toFixed(1)} km`
            : "—";
        const isActive = active === w.id;

        return (
          <motion.li key={w.id} layout className="">
            <motion.div
              layoutId={`card-${w.id}-${id}`}
              ref={ref}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden"
            >
              <motion.button
                layout
                onClick={() => setActive(isActive ? null : w.id)}
                className="w-full text-left flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-900"
                aria-expanded={isActive}
              >
                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg font-semibold text-gray-700 dark:text-gray-200 flex-shrink-0">
                  {initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="truncate">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                        {skills}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                        {distance}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {w.workerProfile?.yearsExperience ?? 0} yrs
                      </div>
                    </div>
                  </div>
                </div>
              </motion.button>

              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-100 dark:border-gray-700 p-4 bg-white dark:bg-gray-800"
                  >
                    <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {w.workerProfile?.bio ?? "No additional details."}
                    </div>
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/workers/${w.id}`}
                        className="text-sm px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        View
                      </Link>
                      {w.role === "WORKER" ? (
                        <BookWorkerButton
                          workerId={w.id}
                          className="px-3 py-1"
                        />
                      ) : (
                        <span className="text-xs text-red-500 px-3 py-1">
                          Invalid role: {w.role}
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.li>
        );
      })}
    </ul>
  );
}
