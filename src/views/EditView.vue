<script setup lang="ts">
import CardView from "@/layout/CardView.vue";
import type { PhotoData } from "@/services/photo/PhotoService";
import { usePhotoStore } from "@/stores/photo";
import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";

import { Button, InputText, Message, Select, Toast, useToast } from "primevue";

import { reactive, ref, watch } from "vue";
import { z } from "zod";

export interface EditPhotoForm {
  title: string;
  albumId: string;
  download_url: string;
}

const photosStore = usePhotoStore();

const selectedPhotoId = ref<string | null>(null);
const loading = ref<boolean>(false);
const showForm = ref<boolean>(false);
const showEditButton = ref<boolean>(true);

const initialValues = reactive<EditPhotoForm>({
  title: "",
  albumId: "",
  download_url: "",
});

const toast = useToast();

const resolver = ref(
  zodResolver(
    z.object({
      title: z.string().min(1, { message: "Título é obrigátorio" }),
      albumId: z.coerce
        .number({ message: "Id do álbum é obrigátorio" })
        .min(1, { message: "Id do álbum deve ser maior que zero" }),
      download_url: z
        .string({ message: "URL da foto é obrigátorio" })
        .url({ message: "URL inválida" }),
    }),
  ),
);

const onFormSubmit = async ({ valid }: FormSubmitEvent) => {
  if (valid) {
    loading.value = true;

    await photosStore.editPhoto(initialValues, Number(selectedPhotoId.value));

    loading.value = false;

    toast.add({
      severity: "success",
      summary: "Foto alterada",
      detail: `Foto com id '${selectedPhotoId.value}' alterada com sucesso`,
      life: 3000,
    });

    selectedPhotoId.value = null;
    showForm.value = false;
  }
};

const validPhoto = (): number | null => {
  if (selectedPhotoId.value === "") {
    toast.add({
      severity: "error",
      summary: "Informe o id da foto",
      life: 3000,
    });

    return null;
  }

  const formattedPhotoId = Number(selectedPhotoId.value);

  if (!Number.isInteger(formattedPhotoId)) {
    toast.add({
      severity: "error",
      summary: "Id da foto inválida",
      life: 3000,
    });

    return null;
  }

  const existPhotoId = photosStore.getPhotos().some((photo) => photo.id === formattedPhotoId);

  if (!existPhotoId) {
    toast.add({
      severity: "error",
      summary: "Id da foto não encontrado",
      life: 3000,
    });

    return null;
  }

  return formattedPhotoId;
};

const editPhoto = () => {
  const photoId = validPhoto();

  if (photoId != null) {
    const photo = photosStore.getPhotos().find((p) => p.id === photoId);

    initialValues.title = photo!.title;
    initialValues.albumId = String(photo!.albumId);
    initialValues.download_url = photo!.download_url;

    showForm.value = true;
    showEditButton.value = false;
  }
};
</script>

<template>
  <CardView>
    <Toast />

    <h1 class="text-2xl">Editar foto</h1>

    <div class="py-8">
      <div class="flex flex-col gap-8">
        <InputText
          v-model="selectedPhotoId"
          type="text"
          placeholder="Informe o id da foto"
          class="w-full lg:w-[300px]"
        />

        <Button
          v-if="showEditButton"
          type="submit"
          severity="secondary"
          label="Editar"
          class="w-full lg:w-[250px]"
          @click="editPhoto"
        />
      </div>

      <Form
        v-if="showForm"
        v-slot="$form"
        :initialValues
        :resolver
        @submit="onFormSubmit"
        class="flex flex-col gap-4 w-full mt-8"
      >
        <div class="flex flex-col lg:flex-row gap-4 lg:gap-12">
          <div class="flex flex-col gap-1 w-full">
            <label for="title">Título</label>
            <InputText
              v-model:model-value="initialValues.title"
              name="title"
              type="text"
              placeholder="Título"
              fluid
            />

            <Message v-if="$form.title?.invalid" severity="error" size="small" variant="simple">
              {{ $form.title.error?.message }}
            </Message>
          </div>

          <div class="flex flex-col gap-1 w-full">
            <label for="albumId">Id do album</label>
            <InputText
              v-model="initialValues.albumId"
              name="albumId"
              type="text"
              placeholder="Id do album"
              fluid
            />

            <Message v-if="$form.albumId?.invalid" severity="error" size="small" variant="simple">
              {{ $form.albumId.error?.message }}
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
          :loading="loading"
        />
      </Form>
    </div>
  </CardView>
</template>
