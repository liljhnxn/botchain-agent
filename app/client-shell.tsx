"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const Providers = dynamic(async () => (await import("./providers")).Providers, {
  ssr: false,
});

export function ClientShell({ children }: { children: ReactNode }) {
  return <Providers>{children}</Providers>;
}
