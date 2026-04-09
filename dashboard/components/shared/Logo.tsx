"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

/* ---------------------------------------------
   Props
--------------------------------------------- */

interface LogoProps {
  size?: number;
  textSize?: string;
  hideText?: boolean;
  className?: string;
}

/* ---------------------------------------------
   Component
--------------------------------------------- */

const Logo = ({
  size = 40,
  textSize = "text-3xl",
  hideText = false,
  className,
}: LogoProps) => {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "flex items-center gap-2 font-bold hover:opacity-90 transition",
        className,
      )}
    >
      {/* Logo Image */}
      <Image
        src="/images/todo-app.png"
        alt="Checky Logo"
        width={size}
        height={size}
        priority
        className="object-contain"
      />

      {/* Brand Name */}
      {!hideText && (
        <span
          className={cn(
            "tracking-wide text-foreground font-extrabold",
            textSize,
          )}
        >
          Checky
        </span>
      )}
    </Link>
  );
};

export default Logo;
