"use client";

import ModeToggle from "@/components/shared/ModeToggle";
import { UserMenu } from "@/components/shared/UserMenu";
import { Button } from "@/components/ui/button";
import { TextAlignJustify } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-20 border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="flex items-center justify-between h-14 px-4 sm:px-8">
        {/* Left */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onToggleSidebar}
          >
            <TextAlignJustify className="!w-6 !h-6" />
          </Button>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default Header;
