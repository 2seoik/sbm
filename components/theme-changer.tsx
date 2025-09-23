"use client";

import { MonitorIcon, MoonStarIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeChanger() {
  const THEMES_ICONS = {
    light: <SunIcon />,
    system: <MonitorIcon />,
    dark: <MoonStarIcon />,
  };

  const { theme, setTheme } = useTheme();
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  if (!mount || !theme) return <button></button>;

  return (
    <div className="rounded-full border border-neutral-300">
      {Object.entries(THEMES_ICONS).map(([themeKey, themeIcon]) => (
        <button
          key={themeKey}
          onClick={() => setTheme(themeKey)}
          className={`m-1.5 cursor-pointer items-center justify-center gap-2 rounded-full px-1.5 py-1.5 font-medium text-sm transition-colors ${
            theme === themeKey
              ? "bg-primary text-primary-foreground" // 선택됨
              : "hover:bg-foreground/10" // 선택 안됨
          }`}
        >
          {themeIcon}
        </button>
      ))}
    </div>
  );
}
