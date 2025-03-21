
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { cn } from "@/lib/utils";
import { Scale, SunMoon } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const scrollPosition = useScrollPosition();
  const isScrolled = scrollPosition > 50;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300",
        isScrolled
          ? "h-14 px-4 bg-background/80 backdrop-blur shadow-md"
          : "h-20 px-6"
      )}
    >
      <Link to="/" className="flex items-center gap-2">
        <Scale
          className={cn(
            "transition-all duration-200",
            isScrolled ? "h-5 w-5" : "h-6 w-6"
          )}
        />
        {!isScrolled ? (
          <span className="text-lg font-medium">Assistente Inteligente PDF</span>
        ) : null}
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle 
          className="h-10 w-10 rounded-full hover:bg-accent flex items-center justify-center transition-colors"
          iconOnly={true}
        />
      </div>
    </header>
  );
}
