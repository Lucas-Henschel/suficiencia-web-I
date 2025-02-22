import { localStorageKeys } from "@/config/localStorageKeys";
import PhotoService, { type ListPhotosParams, type PhotoData } from "@/services/photo/PhotoService";
import type { CreatePhotoForm } from "@/views/AddView.vue";
import { defineStore } from "pinia";

export const usePhotoStore = defineStore(
  "photo",
  () => {
    const list = async (params: ListPhotosParams) => {
      if (getPhotos().length === 0) {
        const { data, error } = await PhotoService.list(params);

        if (!data || error) {
          throw new Error(error);
        }

        localStorage.setItem(localStorageKeys.PHOTOS, JSON.stringify(data));
      }

      return getPhotos();
    };

    const getPhotos = (): PhotoData[] => {
      const photos = localStorage.getItem(localStorageKeys.PHOTOS);
      return JSON.parse(photos || "[]");
    };

    const removePhoto = (photoId: string) => {
      const newPhotos = getPhotos().filter((photo: PhotoData) => photo.id !== photoId);
      localStorage.setItem(localStorageKeys.PHOTOS, JSON.stringify(newPhotos));
    };

    const addPhoto = (photoData: CreatePhotoForm): PhotoData => {
      const id = getPhotos().length + 1;

      const newPhoto: PhotoData = {
        id: String(id),
        download_url: photoData.photoUrl,
        author: photoData.author,
        description: photoData.description,
        url: photoData.photoUrl,
      };

      const photos = getPhotos();
      photos.push(newPhoto);

      localStorage.setItem(localStorageKeys.PHOTOS, JSON.stringify(photos));
      return newPhoto;
    }

    return {
      list,
      getPhotos,
      removePhoto,
      addPhoto,
    };
  },
  {
    persist: true,
  },
);
