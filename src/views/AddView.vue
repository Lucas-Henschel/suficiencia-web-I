<script setup lang="ts">
import { reactive, ref } from "vue";

import CardView from "@/layout/CardView.vue";
import { usePhotoStore } from "@/stores/photo";

import { Form, type FormSubmitEvent } from "@primevue/forms";
import { zodResolver } from "@primevue/forms/resolvers/zod";
import { Button, InputText, Message, Toast, useToast } from "primevue";

import { z } from "zod";

export interface CreatePhotoForm {
  title: string;
  albumId: number | null;
  download_url: string;
}

const initialValues = reactive<CreatePhotoForm>({
  title: "",
  albumId: null,
  download_url: "",
});

const photosStore = usePhotoStore();

const toast = useToast();

const formKey = ref(0);
const loading = ref<boolean>(false);

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

const resetForm = () => {
  initialValues.title = "";
  initialValues.albumId = null;
  initialValues.download_url = "";
};

const onFormSubmit = async ({ valid, values }: FormSubmitEvent) => {
  if (valid) {
    loading.value = true;

    const createdPhoto = await photosStore.addPhoto(values as CreatePhotoForm);

    loading.value = false;

    toast.add({
      severity: "success",
      summary: "Foto adicionada",
      detail: `Foto com id '${createdPhoto.id}' adicionada com sucesso`,
      life: 3000,
    });

    resetForm();
    formKey.value++;
  }
};
</script>

<template>
  <CardView>
    <h1 class="text-2xl">Adicionar uma foto em sua galeria</h1>

    <div class="flex flex-col justify-center my-8">
      <Form
        v-slot="$form"
        :key="formKey"
        :initialValues
        :resolver
        @submit="onFormSubmit"
        class="flex flex-col gap-4 w-full"
      >
        <div class="flex flex-col lg:flex-row gap-4 lg:gap-12">
          <div class="flex flex-col gap-1 w-full">
            <label for="title">Título</label>
            <InputText name="title" type="text" placeholder="Título" fluid />

            <Message v-if="$form.title?.invalid" severity="error" size="small" variant="simple">
              {{ $form.title.error?.message }}
            </Message>
          </div>

          <div class="flex flex-col gap-1 w-full">
            <label for="albumId">Id do album</label>
            <InputText name="albumId" type="text" placeholder="Id do album" fluid />

            <Message v-if="$form.albumId?.invalid" severity="error" size="small" variant="simple">
              {{ $form.albumId.error?.message }}
            </Message>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <label for="download_url">URL da foto</label>
          <InputText name="download_url" type="text" placeholder="URL da foto" fluid />

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
          label="Adicionar"
          class="mt-2"
          :loading="loading"
        />
      </Form>
    </div>

    <Toast />
  </CardView>
</template>
