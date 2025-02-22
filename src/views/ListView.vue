<script setup lang="ts">
import CardView from '@/layout/CardView.vue';
import { usePhotoStore } from '@/stores/photo';

import { Paginator, Skeleton, type PageState } from 'primevue';

import { computed, ref, watchEffect } from 'vue';

const photosStore = usePhotoStore();

const loading = ref<boolean>(true);
const imagesLoaded = ref<boolean>(false);

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(3);

const paginatedPhotos = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage.value;
  const endIndex = startIndex + rowsPerPage.value;

  return photosStore.photos.slice(startIndex, endIndex);
});

const preloadImage = (src: string) => {
  return new Promise<void>((resolve) => {
    const img = new Image();

    img.src = src;
    img.onload = () => resolve();
  });
};

const preloadImages = async () => {
  if (photosStore.photos.length > 0) {
    await Promise.all(photosStore.photos.map(photo => preloadImage(photo.download_url)));

    imagesLoaded.value = true;
    loading.value = false;
  }
};

watchEffect(() => {
  if (photosStore.photos.length > 0) {
    preloadImages();
  }
});

const onPageChange = (event: PageState) => {
  loading.value = true;

  currentPage.value = event.page + 1;
  rowsPerPage.value = event.rows;

  setTimeout(() => {
    preloadImages();
  }, 300);
};
</script>

<template>
  <CardView>
    <h1 class="text-2xl">Galeria de fotos</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-8">
      <div
        class="bg-[#a3a3a3] flex flex-col gap-2 w-full max-w-[400px] p-8 rounded-xl dark:bg-[#444242]"
        v-for="(item, index) in paginatedPhotos"
        :key="index"
      >
        <h2 class="text-black text-center text-xl dark:text-white">#{{ item.id }}</h2>

        <Skeleton v-if="loading" width="336px" height="223px" class="p-8" />
        <img v-else :src="item.download_url" class="rounded-xl w- h-[223px]" :alt="item.author" />

        <span class="bg-[#27272A] text-white rounded-xl text-sm text-center py-1">
          <p>Autor: {{ item.author }}</p>
        </span>
      </div>
    </div>

    <Paginator
      :rows="rowsPerPage"
      :totalRecords="photosStore.photos.length"
      :rowsPerPageOptions="[3, 6, 9]"
      @page="onPageChange"
      class="w-full"
    ></Paginator>

  </CardView>
</template>
