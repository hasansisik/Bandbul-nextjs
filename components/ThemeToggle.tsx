"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateTheme } from "@/redux/actions/userActions";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    // Update local theme immediately for instant UI response
    setTheme(newTheme);

    // Update user theme preference in backend if user is logged in (fire and forget)
    if (user) {
      // Dispatch immediately without waiting
      dispatch(updateTheme(newTheme));
    }
  };

  const getIcon = () => {
    if (theme === "light") {
      return <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />;
    } else {
      return <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />;
    }
  };

  const getTooltip = () => {
    if (theme === "light") return "Açık tema";
    return "Koyu tema";
  };

  // Show a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="sm"
        className="h-9 w-9 hover:bg-accent transition-colors"
        disabled
      >
        <div className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Tema değiştir</span>
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={toggleTheme}
      className="h-9 w-9 hover:bg-accent transition-colors"
      title={getTooltip()}
    >
      {getIcon()}
      <span className="sr-only">{getTooltip()}</span>
    </Button>
  );
}
