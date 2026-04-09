"use client";

import { ReactNode } from "react";
import { Toaster } from "sonner";
import { ThemeProvider } from "./ThemeProvider";
import { UserProvider } from "./UserProvider";

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <UserProvider>
      <ThemeProvider>
        <Toaster
          position="top-center"
          duration={3000}
          richColors
          toastOptions={{
            unstyled: false,
            classNames: {
              toast:
                "group !bg-white/70 dark:!bg-zinc-900/70 !backdrop-blur-2xl !text-foreground !rounded-[.75rem] !border-2 !border-border/40 !shadow-lg !shadow-black/10 !px-3 !py-2 font-manrope !transition-all !duration-500 hover:!scale-[1.01]",
              title: "font-manrope text-sm font-bold",
              description: "font-manrope text-xs opacity-80",
              success: "!border-success/30 !bg-success/5 !text-success",
              error: "!border-destructive/30 !bg-destructive/5 !text-destructive",
              warning: "!border-warning/30 !bg-warning/5 !text-warning",
              info: "!border-primary/30 !bg-primary/5 !text-primary",
            },
            style: {
              fontFamily: "var(--font-manrope)",
            },
          }}
        />
        {children}
      </ThemeProvider>
    </UserProvider>
  );
};

export default Providers;
