"use client";

import { HeroUIProvider } from "@heroui/react";

export function ClientHeroUIProvider({ children }: { children: React.ReactNode }) {
  return <HeroUIProvider>{children}</HeroUIProvider>;
}