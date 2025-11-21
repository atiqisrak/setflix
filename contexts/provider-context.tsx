"use client";

import { createContext, useContext, ReactNode } from "react";
import { useProvider, UseProviderReturn } from "@/hooks/use-provider";

interface ProviderContextType extends UseProviderReturn {}

const ProviderContext = createContext<ProviderContextType | undefined>(
  undefined
);

export function ProviderProvider({ children }: { children: ReactNode }) {
  const providerData = useProvider();

  return (
    <ProviderContext.Provider value={providerData}>
      {children}
    </ProviderContext.Provider>
  );
}

export function useProviderContext(): ProviderContextType {
  const context = useContext(ProviderContext);

  if (context === undefined) {
    throw new Error(
      "useProviderContext must be used within a ProviderProvider"
    );
  }

  return context;
}
