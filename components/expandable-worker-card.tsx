"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import BookWorkerButton from "@/components/book-worker-button";

type WorkerLite = {
  id: string;
  name?: string | null;
  workerProfile?: {
    skilledIn?: string[] | null;
    city?: string | null;
    yearsExperience?: number | null;
    profilePic?: string | null;
    bio?: string | null;
  } | null;
  distanceKm?: number | null;
};

export default function ExpandableWorkerCard({ worker }: { worker: WorkerLite }) {
  const [open, setOpen] = useState(false);
  const name = worker.name ?? "Professional";
  const initial = name.charAt(0);
  const skillsText = worker.workerProfile?.skilledIn && worker.workerProfile?.skilledIn.length > 0
    ? worker.workerProfile!.skilledIn!.slice(0,3).join(", ")
    : "No skills listed";
  const distance = typeof worker.distanceKm === "number"
    ? worker.distanceKm < 1 ? `${Math.round(worker.distanceKm * 1000)} m` : `${worker.distanceKm.toFixed(1)} km`
    : "—";

  return (
    <motion.div layout>
      <Card className="overflow-hidden p-0" data-worker-id={worker.id}>
        <motion.button
          layout
          onClick={() => setOpen(!open)}
          className="w-full text-left flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
          aria-expanded={open}
        >
          <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg font-semibold text-gray-700 dark:text-gray-200 flex-shrink-0">
            {initial}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="truncate">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{name}</h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{skillsText}</p>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300">{distance}</div>
                <div className="text-xs text-gray-500 mt-1">{worker.workerProfile?.yearsExperience ?? 0} yrs</div>
              </div>
            </div>
          </div>
        </motion.button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-gray-100 dark:border-gray-700 p-4 bg-white dark:bg-gray-800"
            >
              <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">{worker.workerProfile?.bio ?? 'No additional details.'}</div>
              <div className="flex items-center gap-3">
                <Link href={`/worker/${worker.id}`} className="text-sm px-3 py-1 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">View</Link>
                <BookWorkerButton workerId={worker.id} className="px-3 py-1" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
