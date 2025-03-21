
import { useScrollPosition } from "@/hooks/useScrollPosition";
import { cn } from "@/lib/utils";
import { Scale, Menu } from "lucide-react";
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
        "fixed top-0 left-0 right-0 z-50 flex items-center transition-all duration-300 bg-background/95 backdrop-blur-sm shadow-sm",
        isScrolled
          ? "h-14 px-4"
          : "h-20 px-6"
      )}
    >
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="h-10 w-10 rounded-full hover:bg-accent flex items-center justify-center transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Opções</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <ThemeToggle className="w-full justify-start px-0" />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex-1 flex justify-center">
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
      </div>
      
      <div className="w-10"></div> {/* Empty div to balance the layout */}
    </header>
  );
}
