<script setup lang="ts">
import { Skeleton } from 'primevue';

interface PhotoCardProps {
  id: number,
  downloadUrl: string,
  author: string,
  loading: boolean,
}

const { id, downloadUrl, author } = defineProps<PhotoCardProps>();
</script>

<template>
  <div
    class="bg-[#a3a3a3] flex flex-col gap-2 w-full max-w-[400px] p-8 rounded-xl dark:bg-[#444242]"
  >
    <h2 class="text-black text-center text-xl dark:text-white">
      #{{ id }}
    </h2>

    <Skeleton v-if="loading" width="336px" height="223px" class="p-8" />
    <img v-else :src="downloadUrl" class="rounded-xl w- h-[223px]" :alt="author" />

    <span class="bg-[#27272A] text-white rounded-xl text-sm text-center py-1">
      <p>Autor: {{ author }}</p>
    </span>
  </div>
</template>
