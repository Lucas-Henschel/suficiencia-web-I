<script setup lang="ts">
import type { PhotoData } from '@/services/photo/PhotoService';

interface PhotoCardProps {
  photo: PhotoData,
}

const { photo } = defineProps<PhotoCardProps>();
</script>

<template>
  <div
    class="bg-[#a3a3a3] flex flex-col gap-2 w-full min-w-[350px] max-w-[400px] rounded-xl dark:bg-[#444242]"
  >
    <img
      :src="photo.download_url"
      class="rounded-t-xl h-[223px] w-full object-cover"
      :alt="photo.description"
    />

    <div class="px-6 mb-6">
      <div class="flex justify-between items-center my-4 text-black dark:text-white">
        <h1 class="text-lg">
          {{ photo.author }}
        </h1>

        <h3>
          #{{ photo.id }}
        </h3>
      </div>

      <div class="bg-[#27272A] text-white rounded-xl text-sm text-center py-1">
        <p>
          Descrição: {{ photo.description ? photo.description : 'Sem descrição' }}
        </p>
      </div>
    </div>
  </div>
</template>
