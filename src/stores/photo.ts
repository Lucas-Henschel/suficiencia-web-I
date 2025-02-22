import PhotoService, { type ListPhotosParams, type PhotoData } from "@/services/photo/PhotoService";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePhotoStore = defineStore(
  "photo",
  () => {
    const photos = ref<PhotoData[]>([]);

    const list = async (params: ListPhotosParams) => {
      const { data, error } = await PhotoService.list(params);

      if (!data || error) {
        throw new Error(error);
      }

      photos.value = data;

      return photos;
    };

    return {
      list,
      photos,
    };
  },
  {
    persist: true,
  },
);
