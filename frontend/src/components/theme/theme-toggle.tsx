"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";
import { useThemeStore, Theme, getResolvedTheme } from "@/stores/theme-store";
import { useTranslations } from "next-intl";

interface ThemeToggleProps {
  variant?: "icon" | "dropdown" | "segmented";
  className?: string;
}

export function ThemeToggle({ variant = "icon", className }: ThemeToggleProps) {
  const t = useTranslations("theme");
  const { theme, setTheme } = useThemeStore();
  // `false` on the server, `true` once hydrated - `useMounted` says why.
  const mounted = useMounted();

  const resolvedTheme = getResolvedTheme(theme);

  const cycleTheme = () => {
    const themes: Theme[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme ?? "system");
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex] ?? "system");
  };

  if (variant === "segmented") {
    const options = [
      { value: "light", Icon: Sun },
      { value: "dark", Icon: Moon },
      { value: "system", Icon: Monitor },
    ] as const;

    return (
      <div
        role="group"
        aria-label={t("appearance")}
        className={cn("nexbase-theme-picker", className)}
      >
        {options.map(({ value, Icon }) => (
          <Button
            key={value}
            type="button"
            variant="ghost"
            size="sm"
            aria-pressed={mounted && theme === value}
            onClick={() => setTheme(value)}
          >
            <Icon className="size-3.5" aria-hidden />
            <span>{t(value)}</span>
          </Button>
        ))}
      </div>
    );
  }

  // Render placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className={className} aria-label={t("toggleTheme")}>
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={cycleTheme}
        className={className}
        aria-label={t("switchThemeCurrent", { theme })}
        title={t("themeTitle", { theme })}
      >
        {resolvedTheme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        {theme === "system" && <span className="sr-only">{t("followingSystem")}</span>}
      </Button>
    );
  }

  return (
    <div className={`flex gap-1 ${className}`}>
      <Button
        variant={theme === "light" ? "default" : "ghost"}
        size="icon"
        onClick={() => setTheme("light")}
        aria-label={t("lightMode")}
        title={t("lightMode2")}
      >
        <Sun className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === "dark" ? "default" : "ghost"}
        size="icon"
        onClick={() => setTheme("dark")}
        aria-label={t("darkMode")}
        title={t("darkMode2")}
      >
        <Moon className="h-4 w-4" />
      </Button>
      <Button
        variant={theme === "system" ? "default" : "ghost"}
        size="icon"
        onClick={() => setTheme("system")}
        aria-label={t("systemTheme")}
        title={t("systemTheme2")}
      >
        <Monitor className="h-4 w-4" />
      </Button>
    </div>
  );
}
