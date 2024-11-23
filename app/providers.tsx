"use client";

import { AssistantProvider } from "@/context/assistantContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return <AssistantProvider>{children}</AssistantProvider>;
}
