<script setup lang="ts">
import { ref } from 'vue';

import { Button } from 'primevue';
import Menubar from 'primevue/menubar';

import { useRoute, useRouter } from 'vue-router';
import { useThemeStore } from '@/stores/themeStore';
import { useTheme } from '@/layout/useTheme';

const router = useRouter();
const route = useRoute();

const themeStore = useThemeStore();

const { toggleTheme } = useTheme();

const activeItem = ref(route.path);
const items = ref([
  {
    label: 'Listar',
    icon: 'pi pi-images',
    command: () => setActiveItem("/"),
  },
  {
    label: 'Inserir',
    icon: 'pi pi-plus',
    command: () => setActiveItem("/add"),
  },
  {
    label: 'Alterar',
    icon: 'pi pi-pencil',
    command: () => setActiveItem("/edit"),
  },
  {
    label: 'Excluir',
    icon: 'pi pi-trash',
    command: () => setActiveItem("/remove"),
  }
]);

const setActiveItem = (path: string) => {
  activeItem.value = path;
  router.push(path);
};
</script>

<template>
  <Menubar :model="items">
    <template #item="{ item, props }">
      <a class="flex items-center" v-bind="props.action">
        <i :class="item.icon" />
        <span>{{ item.label }}</span>
      </a>
    </template>
    <template #end>
      <div class="flex items-center gap-2">
        <Button variant="text" @click="toggleTheme">
          <i :class="['pi', themeStore.isDarkTheme ? 'pi-sun text-white' : 'pi-moon text-black']" />
        </Button>
      </div>
    </template>
  </Menubar>
</template>
