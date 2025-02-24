<script setup lang="ts">
import { RouterView } from "vue-router";
import { useTheme } from "./layout/useTheme";

const { updateTheme } = useTheme();

updateTheme();
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
