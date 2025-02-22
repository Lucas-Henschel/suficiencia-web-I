<script setup lang="ts">
import { RouterView } from "vue-router";
import { useTheme } from "./layout/useTheme";
import { useToast } from "primevue";
import { usePhotoStore } from "./stores/photo";

const { updateTheme } = useTheme();

const photosStore = usePhotoStore();

const toast = useToast();

const listAllPhotos = async () => {
  try {
    const params = {
      page: 1,
      limit: 999,
    };

    await photosStore.list(params);
  } catch (err) {
    const error = err as Error;

    toast.add({
      severity: "error",
      summary: error.message,
      life: 3000,
    });
  }
}

updateTheme();
listAllPhotos();
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
