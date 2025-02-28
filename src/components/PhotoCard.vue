<script setup lang="ts">
import type { PhotoData } from "@/services/photo/PhotoService";

interface PhotoCardProps {
  photo: PhotoData;
}

const { photo } = defineProps<PhotoCardProps>();
</script>

<template>
  <div
    class="bg-[#a3a3a3] flex flex-col gap-2 w-[350px] rounded-xl dark:bg-[#444242] lg:max-w-[400px]"
  >
    <img
      v-if="photo.download_url"
      :src="photo.download_url"
      class="rounded-t-xl h-[223px] w-full object-cover"
      :alt="photo.title"
    />
    <img
      v-else
      src="../assets/image-not-found.png"
      class="rounded-t-xl h-[223px] w-full object-cover"
      :alt="photo.title"
    />

    <div class="px-6 mb-6">
      <div class="flex justify-between gap-4 items-center my-4 text-black dark:text-white">
        <h1 class="text-lg">
          {{ photo.title }}
        </h1>

        <h3 class="text-2xl">#{{ photo.id }}</h3>
      </div>
    </div>
  </div>
</template>
