import { useThemeStore } from "@/stores/themeStore";

export function useTheme() {
  const themeStore = useThemeStore();

  const toggleTheme = () => {
    themeStore.handleTheme();
    updateTheme();
  };

  const updateTheme = () => {
    const html = document.documentElement;
    if (themeStore.isDarkTheme) {
      html.classList.add("dark");
      html.style.colorScheme = "dark";
    } else {
      html.classList.remove("dark");
      html.style.colorScheme = "light";
    }
  };

  return {
    toggleTheme,
    updateTheme,
  };
}
