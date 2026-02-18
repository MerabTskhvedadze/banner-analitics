"use client";

import { Button } from "antd";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import { useTheme } from "./theme-provider";

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="text"
      icon={theme === "dark" ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
      onClick={toggleTheme}
      aria-label="Toggle theme"
    />
  );
}
