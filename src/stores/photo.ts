import { localStorageKeys } from "@/config/localStorageKeys";
import PhotoService, { type ListPhotosParams, type PhotoData } from "@/services/photo/PhotoService";
import type { CreatePhotoForm } from "@/views/AddView.vue";
import type { EditPhotoForm } from "@/views/EditView.vue";
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
      const photos = getPhotos();
      const lastPhoyo = photos[photos.length - 1];
      const newId = Number(lastPhoyo.id) + 1;

      const newPhoto: PhotoData = {
        id: String(newId),
        download_url: photoData.download_url,
        author: photoData.author,
        description: photoData.description,
        url: photoData.download_url,
      };

      photos.push(newPhoto);
      localStorage.setItem(localStorageKeys.PHOTOS, JSON.stringify(photos));

      return newPhoto;
    };

    const editPhoto = (photoData: EditPhotoForm, photoId: string) => {
      const photos = getPhotos().map(photo =>
        photo.id === photoId ? { ...photo, ...photoData } : photo
      );

      localStorage.setItem(localStorageKeys.PHOTOS, JSON.stringify(photos));
    };

    return {
      list,
      getPhotos,
      removePhoto,
      addPhoto,
      editPhoto,
    };
  },
  {
    persist: true,
  },
);
