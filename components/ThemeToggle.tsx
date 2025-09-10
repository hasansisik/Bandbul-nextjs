"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { updateTheme } from "@/redux/actions/userActions";
import { useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);

  // Sync theme with user preference when user is loaded
  useEffect(() => {
    if (user?.theme && user.theme !== theme) {
      setTheme(user.theme);
    }
  }, [user?.theme, theme, setTheme]);

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";

    // Update local theme immediately for instant UI response
    setTheme(newTheme);

    // Update user theme preference in backend if user is logged in (fire and forget)
    if (user) {
      // Don't await - let it run in background
      dispatch(updateTheme(newTheme)).catch((error) => {
        console.error("Failed to update theme preference:", error);
        // Optionally revert theme on error, but don't block UI
        // setTheme(theme);
      });
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
