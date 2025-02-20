<script setup lang="ts">
import CardView from '@/layout/CardView.vue';
import { usePhotoStore } from '@/stores/photo';

import { ProgressSpinner, useToast } from 'primevue';
import { ref } from 'vue';

const photosStore = usePhotoStore();

const toast = useToast();

const loading = ref<boolean>(true);

const listPhotos = async () => {
  try {
    const params = {
      limit: 5000,
    };

    await photosStore.list(params);

    loading.value = false;
  } catch (err) {
    const error = err as Error;

    toast.add({
      severity: "error",
      summary: error.message,
      life: 3000,
    });
  }
}

listPhotos();
</script>

<template>
  <CardView>
    <h1 class="mb-6 text-2xl ">Galeria de fotos</h1>

    <div class="flex justify-center" v-if="loading">
      <ProgressSpinner />
    </div>
    <div v-else class="flex flex-wrap justify-between gap-12">
      <div
        class="bg-[#7c7c7c] flex flex-col gap-2 w-[400px] p-8 rounded-xl"
        v-for="(item, index) in photosStore.photos"
        :key="index"
      >
        <h2 class="text-white text-center text-xl">#{{ item.id }}</h2>

        <img :src="item.download_url" class="rounded-xl" alt="photo" />

        <span class="bg-[#27272A] text-white rounded-xl text-sm text-center py-1">
          <p>Autor: {{ item.author }}</p>
        </span>
      </div>
    </div>

  </CardView>
</template>
