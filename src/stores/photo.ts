import { localStorageKeys } from "@/config/localStorageKeys";
import PhotoService, { type ListPhotosParams, type PhotoData } from "@/services/photo/PhotoService";
import { defineStore } from "pinia";

export const usePhotoStore = defineStore(
  "photo",
  () => {
    const list = async (params: ListPhotosParams) => {
      const { data, error } = await PhotoService.list(params);

      if (!data || error) {
        throw new Error(error);
      }

      localStorage.setItem(localStorageKeys.PHOTOS, JSON.stringify(data));

      return data;
    };

    const getPhotos = (): PhotoData[] => {
      const photos = localStorage.getItem(localStorageKeys.PHOTOS);
      return JSON.parse(photos || "[]");
    }

    const removePhoto = (photoId: string) => {
      const newPhotos = getPhotos().filter((photo: PhotoData) => photo.id !== photoId);
      localStorage.setItem(localStorageKeys.PHOTOS, JSON.stringify(newPhotos));
    }

    return {
      list,
      getPhotos,
      removePhoto,
    };
  },
  {
    persist: true,
  },
);
