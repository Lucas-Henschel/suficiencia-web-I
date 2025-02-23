<script setup lang="ts">
import { reactive, ref } from 'vue';

import CardView from '@/layout/CardView.vue';
import { usePhotoStore } from '@/stores/photo';

import { Form, type FormSubmitEvent } from '@primevue/forms';
import { zodResolver } from '@primevue/forms/resolvers/zod';
import { Button, InputText, Message, Toast, useToast } from 'primevue';

import { z } from 'zod';

export interface CreatePhotoForm {
  author: string;
  description: string;
  download_url: string;
}

const initialValues = reactive<CreatePhotoForm>({
  author: '',
  description: '',
  download_url: '',
});

const photosStore = usePhotoStore();

const toast = useToast();

const formKey = ref(0);

const resolver = ref(zodResolver(
  z.object({
    author: z.string().min(1, { message: 'Nome do autor é obrigátorio' }),
    description: z.string().min(1, { message: 'Descrição da imagem é obrigátorio' }),
    download_url: z
      .string({ message: 'URL da foto é obrigátorio' })
      .url({ message: 'URL inválida' }),
  })
));

const resetForm = () => {
  initialValues.author = '';
  initialValues.description = '';
  initialValues.download_url = '';
}

const onFormSubmit = ({ valid }: FormSubmitEvent) => {
  if (valid) {
    const createdPhoto = photosStore.addPhoto(initialValues);

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
        <div class="flex gap-12">
          <div class="flex flex-col gap-1 w-full">
            <label for="author">Autor</label>
            <InputText
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
          label="Adicionar"
          class="mt-2"
        />
      </Form>
    </div>

    <Toast />
  </CardView>
</template>
