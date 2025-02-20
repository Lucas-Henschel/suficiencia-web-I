import { defineStore } from "pinia";
import { ref } from "vue";

export const useThemeStore = defineStore(
  "theme",
  () => {
    const isDarkTheme = ref(true);

    const handleTheme = () => {
      isDarkTheme.value = !isDarkTheme.value;
    };

    return { isDarkTheme, handleTheme };
  },
  {
    persist: true,
  },
);
