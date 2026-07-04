"use client";

import { ThemeProvider } from "next-themes";

import { designSystem } from "@/design-system";

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={designSystem.defaultTheme}
      enableSystem
      disableTransitionOnChange
      themes={[...designSystem.themes]}
    >
      {children}
    </ThemeProvider>
  );
}
