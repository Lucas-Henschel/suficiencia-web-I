<script setup lang="ts">
import { ref } from 'vue';

import InputText from 'primevue/inputtext';

import CardView from '@/layout/CardView.vue';
import { Button, Toast, useToast } from 'primevue';
import { usePhotoStore } from '@/stores/photo';

const toast = useToast();

const photosStore = usePhotoStore();

const selectedPhotoId = ref<string>("");

const validPhotoId = (): string | null => {
  if (selectedPhotoId.value === "") {
    toast.add({
      severity: "error",
      summary: "Informe o id da foto",
      life: 3000,
    });

    return null;
  }

  const existPhotoId = photosStore.getPhotos().some(photo => photo.id === selectedPhotoId.value);

  if (!existPhotoId) {
    toast.add({
      severity: "error",
      summary: "Id da foto não encontrado",
      life: 3000,
    });

    return null;
  }

  return selectedPhotoId.value;
}

const resetForm = () => {
  selectedPhotoId.value = "";
};

const removePhoto = () => {
  const photoId = validPhotoId();

  if (photoId != null) {
    photosStore.removePhoto(photoId);

    toast.add({
      severity: "success",
      summary: "Foto removida",
      detail: `Foto com id '${photoId}'' removido com sucesso`,
      life: 3000,
    });
  }

  resetForm();
};

</script>

<template>
  <Toast />

  <CardView>
    <h1 class="text-2xl">Excluir foto</h1>

    <div class="flex flex-col gap-8 my-8">
      <InputText
        type="text"
        v-model="selectedPhotoId"
        placeholder="Informe o id da foto"
        class="w-[300px]"
      />

      <Button @click="removePhoto" label="Excluir" severity="danger" class="w-[150px]" />
    </div>
  </CardView>
</template>
