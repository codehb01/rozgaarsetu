import { ReactNode } from "react";

export default function WorkerLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-gray-900">{children}</div>;
}
