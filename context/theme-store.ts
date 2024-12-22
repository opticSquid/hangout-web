import { create } from "zustand";

type ThemeStore = {
  themeState: string;
  setThemeState: (newTheme: string) => void;
};
export const useThemeStore = create<ThemeStore>()((set) => ({
  themeState: "dark",
  setThemeState: (newTheme: string) =>
    set((prevState) => ({ themeState: newTheme })),
}));
