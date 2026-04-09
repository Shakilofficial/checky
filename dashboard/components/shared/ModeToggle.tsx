/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ModeToggle = () => {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="
          h-9 w-9 rounded-full
          border-2 border-border
          bg-background
          transition-colors
          hover:bg-primary/20
        "
    >
      {currentTheme === "dark" ? (
        <Moon className="h-5! w-5!" />
      ) : (
        <Sun className="h-5! w-5!" />
      )}
    </Button>
  );
};

export default ModeToggle;
