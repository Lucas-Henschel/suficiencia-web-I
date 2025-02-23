<script setup lang="ts">
import CardView from '@/layout/CardView.vue';
import type { PhotoData } from '@/services/photo/PhotoService';
import { usePhotoStore } from '@/stores/photo';
import { Form, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';

import { Button, InputText, Message, Select, Toast, useToast } from 'primevue';

import { reactive, ref, watch } from 'vue';
import { z } from 'zod';

export interface EditPhotoForm {
  author: string;
  description: string;
  download_url: string;
}

const photosStore = usePhotoStore();

const selectedPhoto = ref<PhotoData | null>(null);

const initialValues = reactive<EditPhotoForm>({
  author: '',
  description: '',
  download_url: '',
});

watch(selectedPhoto, (photo) => {
  if (photo) {
    initialValues.author = photo.author;
    initialValues.description = photo.description;
    initialValues.download_url = photo.download_url;
  }
});

const toast = useToast();

const resolver = ref(zodResolver(
  z.object({
    author: z.string().min(1, { message: 'Nome do autor é obrigátorio' }),
    description: z.string().min(1, { message: 'Descrição da imagem é obrigátorio' }).optional(),
    photoUrl: z.string().min(1, { message: 'URL da foto é obrigátorio' }),
  })
));


const onFormSubmit = ({ valid }: FormSubmitEvent) => {
  if (valid) {
    photosStore.editPhoto(initialValues, selectedPhoto.value!.id);

    toast.add({
      severity: "success",
      summary: "Foto alterada",
      detail: `Foto com id '${selectedPhoto.value!.id}' alterada com sucesso`,
      life: 3000,
    });

    selectedPhoto.value = null;
  }
};

</script>

<template>
  <CardView>
    <Toast />

    <h1 class="text-2xl">Editar foto</h1>

    <div class="py-8">
      <Select
        v-model="selectedPhoto"
        :options="photosStore.getPhotos()"
        filter
        optionLabel="id"
        placeholder="Selecione o id da foto"
        class="w-[300px] mb-8"
      />

      <Form
        v-if="selectedPhoto"
        v-slot="$form"
        :initialValues
        :resolver
        @submit="onFormSubmit"
        class="flex flex-col gap-4 w-full"
      >
        <div class="flex gap-12">
          <div class="flex flex-col gap-1 w-full">
            <label for="author">Autor</label>
            <InputText
              v-model:model-value="initialValues.author"
              name="author"
              type="text"
              placeholder="Autor"
              fluid
            />

            <Message
              v-if="$form.author?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.author.error?.message }}
            </Message>
          </div>

          <div class="flex flex-col gap-1 w-full">
            <label for="description">Descrição da imagem</label>
            <InputText
              v-model:model-value="initialValues.description"
              name="description"
              type="text"
              placeholder="Descrição da imagem"
              fluid
            />

            <Message
              v-if="$form.description?.invalid"
              severity="error"
              size="small"
              variant="simple"
            >
              {{ $form.description.error?.message }}
            </Message>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label for="download_url">URL da foto</label>
          <InputText
            v-model:model-value="initialValues.download_url"
            name="download_url"
            type="text"
            placeholder="URL da foto"
            fluid
          />

          <Message
            v-if="$form.download_url?.invalid"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ $form.download_url.error?.message }}
          </Message>
        </div>

        <Button
          type="submit"
          severity="secondary"
          label="Alterar"
          class="mt-2"
        />
      </Form>
    </div>
  </CardView>
</template>
