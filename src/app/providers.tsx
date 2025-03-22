"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from "react";

// ThemeProviderProps tipini kendimiz tanımlayalım
type Attribute = string;
type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: string;
  storageKey?: string;
  themes?: string[];
  forcedTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  enableColorScheme?: boolean;
  attribute?: Attribute | Attribute[] | undefined;
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props} attribute="class">{children}</NextThemesProvider>;
}