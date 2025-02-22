<script setup lang="ts">
import type { PhotoData } from '@/services/photo/PhotoService';
import { Skeleton } from 'primevue';

interface PhotoCardProps {
  photo: PhotoData,
  loading: boolean,
}

const { photo, loading } = defineProps<PhotoCardProps>();
</script>

<template>
  <div
    class="bg-[#a3a3a3] flex flex-col gap-2 w-full min-w-[350px] max-w-[400px] p-8 rounded-xl dark:bg-[#444242]"
  >
    <h2 class="text-black text-center text-xl dark:text-white">
      #{{ photo.id }}
    </h2>

    <Skeleton v-if="loading" width="334px" height="223px" class="p-8" />
    <img
      v-else
      :src="photo.download_url"
      class="rounded-xl h-[223px]"
      :alt="photo.description ?? photo.author"
    />

    <span class="bg-[#27272A] text-white rounded-xl text-sm text-center py-1">
      <p>Autor: {{ photo.author }}</p>
    </span>
  </div>
</template>
