'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ReactNode } from "react"; 

type ThemeProviderProps = {
  children: ReactNode;
} & React.ComponentProps<typeof NextThemesProvider>;

export const ThemeProvider = ({
  children,
  ...props
}: ThemeProviderProps) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};
