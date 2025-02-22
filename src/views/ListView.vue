<script setup lang="ts">
import PhotoCard from '@/components/PhotoCard.vue';
import CardView from '@/layout/CardView.vue';
import { usePhotoStore } from '@/stores/photo';
import { preloadImage } from '@/utils/imageHelper';

import { Paginator, type PageState } from 'primevue';

import { computed, ref, watchEffect } from 'vue';

const photosStore = usePhotoStore();

const loading = ref<boolean>(true);
const imagesLoaded = ref<boolean>(false);

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(3);

const paginatedPhotos = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage.value;
  const endIndex = startIndex + rowsPerPage.value;

  return photosStore.getPhotos().slice(startIndex, endIndex);
});

const photosLength = computed(() => photosStore.getPhotos().length);

const preloadImages = async () => {
  if (photosLength.value > 0) {
    await Promise.all(photosStore.getPhotos().map(photo => preloadImage(photo.download_url)));

    imagesLoaded.value = true;
    loading.value = false;
  }
};

watchEffect(() => {
  if (photosLength.value > 0) {
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
      <PhotoCard
        v-for="(item, index) in paginatedPhotos"
        :id="item.id"
        :downloadUrl="item.download_url"
        :author="item.author"
        :loading="loading"
        :key="index"
      />
    </div>

    <Paginator
      :rows="rowsPerPage"
      :totalRecords="photosLength"
      :rowsPerPageOptions="[3, 6, 9]"
      @page="onPageChange"
      class="w-full"
    />
  </CardView>
</template>
