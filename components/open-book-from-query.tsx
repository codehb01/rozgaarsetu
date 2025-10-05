"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function OpenBookFromQuery({ workerId }: { workerId: string }) {
  const sp = useSearchParams();
  useEffect(() => {
    const action = sp.get("action");
    if (action === "book") {
      try {
        const custom = new CustomEvent('rozgaar:openBook', { detail: { workerId } });
        window.dispatchEvent(custom);
      } catch (err) {}
    }
  }, [sp, workerId]);
  return null;
}
