<script setup lang="ts">
import { RouterView } from "vue-router";
import AppTopBar from "@/layout/AppTopBar.vue";
</script>

<template>
  <div class="min-h-screen">
    <AppTopBar />

    <main class="flex-1 flex">
      <RouterView />
    </main>
  </div>
</template>

<style></style>
