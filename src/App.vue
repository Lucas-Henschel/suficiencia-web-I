<script setup lang="ts">
import { RouterView } from "vue-router";
import { useTheme } from "./layout/useTheme";
import { usePhotoStore } from "./stores/photo";
import { onMounted } from "vue";
import type { ListPhotosParams } from "./services/photo/PhotoService";
const { updateTheme } = useTheme();

const photosStore = usePhotoStore();

updateTheme();

onMounted(() => {
  const param: ListPhotosParams = {
    page: 1,
    limit: 999,
  }

  photosStore.list(param);
});
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
