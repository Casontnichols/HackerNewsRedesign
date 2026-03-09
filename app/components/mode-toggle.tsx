import { Moon, Sun } from "lucide-react";
import { useTheme } from "~/components/theme-provider";
import { Toggle } from "./ui/toggle";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return <Toggle aria-label="Toggle theme" onClick={toggleTheme}>
    {isDark ? (
      <Sun className="h-5! w-5!" fill="white"/>
    ): (
      <Moon className="h-5! w-5!" fill="black"/>
    )}
  </Toggle>;
}
