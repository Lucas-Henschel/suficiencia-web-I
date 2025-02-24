<script setup lang="ts">
import PhotoCard from '@/components/PhotoCard.vue';
import CardView from '@/layout/CardView.vue';
import type { ListPhotosParams, PhotoData } from '@/services/photo/PhotoService';
import { usePhotoStore } from '@/stores/photo';
import { preloadImage } from '@/utils/imageHelper';

import { Paginator, Skeleton, type PageState } from 'primevue';

import { ref } from 'vue';

const photosStore = usePhotoStore();

const loading = ref<boolean>(true);

const currentPage = ref<number>(1);
const rowsPerPage = ref<number>(3);

const paginatedPhotos = ref<PhotoData[]>([]);

const getPaginatedPhotos = () => {
  const startIndex = (currentPage.value - 1) * rowsPerPage.value;
  const endIndex = currentPage.value * rowsPerPage.value;

  paginatedPhotos.value = photosStore.getPhotos().slice(startIndex, endIndex);
}

const preloadImages = async () => {
  if (paginatedPhotos.value.length === 0) {
    return;
  }

  const results = await Promise.allSettled(
    paginatedPhotos.value.map(photo => preloadImage(photo.download_url))
  );

  results.forEach((result, index) => {
    if (result.status === "rejected") {
      paginatedPhotos.value[index].download_url = "./../assets/image-not-found.png";
    }
  });

  loading.value = false;
};

const fetchPhotos = async () => {
  loading.value = true;

  getPaginatedPhotos();
  await preloadImages();
};

const onPageChange = async (event: PageState) => {
  currentPage.value = event.page + 1;
  rowsPerPage.value = event.rows;

  await fetchPhotos();
};

const listAllPhotos = async () => {
  const param: ListPhotosParams = {
    page: 1,
    limit: 999,
  }

  await photosStore.list(param);
  await fetchPhotos();
}

listAllPhotos();
</script>

<template>
  <CardView class="px-0">
    <div class="flex flex-col justify-center items-center my-8">
      <h1 class="text-2xl mb-4">Galeria de fotos</h1>

      <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 ">
        <Skeleton
          v-for="(item, index) in rowsPerPage"
          width="350px"
          height="343px"
          :key="index"
        />
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
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
