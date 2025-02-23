<script setup lang="ts">
import PhotoCard from '@/components/PhotoCard.vue';
import CardView from '@/layout/CardView.vue';
import { usePhotoStore } from '@/stores/photo';
import { preloadImage } from '@/utils/imageHelper';

import { Paginator, Skeleton, type PageState } from 'primevue';

import { computed, onMounted, ref } from 'vue';

const photosStore = usePhotoStore();

const loading = ref<boolean>(true);

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(3);

const paginatedPhotos = computed(() => {
  const startIndex = (currentPage.value - 1) * rowsPerPage.value;
  return photosStore.getPhotos().slice(startIndex, startIndex + rowsPerPage.value);
});

const preloadImages = async () => {
  await Promise.all(paginatedPhotos.value.map(photo => preloadImage(photo.download_url)));
  loading.value = false;
};

const fetchPhotos = async () => {
  loading.value = true;

  await preloadImages();
};

const onPageChange = async (event: PageState) => {
  currentPage.value = event.page + 1;
  rowsPerPage.value = event.rows;

  await fetchPhotos();
};

onMounted(fetchPhotos);
</script>

<template>
  <CardView class="px-0">
    <div class="flex flex-col justify-center items-center my-8">
      <h1 class="text-2xl mb-4">Galeria de fotos</h1>

      <div v-if="loading" class="flex flex-wrap justify-center gap-12">
        <Skeleton
          v-for="(item, index) in rowsPerPage"
          width="350px"
          height="343px"
          :key="index"
        />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 ">
        <PhotoCard
          v-for="(item, index) in paginatedPhotos"
          :photo="item"
          :key="index"
        />
      </div>
    </div>

    <Paginator
      :rows="rowsPerPage"
      :totalRecords="photosStore.getPhotos().length"
      :rowsPerPageOptions="[3, 6, 9]"
      @page="onPageChange"
      class="w-full"
    />
  </CardView>
</template>
