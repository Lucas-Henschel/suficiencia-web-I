import { localStorageKeys } from "@/config/localStorageKeys";
import PhotoService, { type ListImagesParams, type PhotoData } from "@/services/photo/PhotoService";
import type { CreatePhotoForm } from "@/views/AddView.vue";
import type { EditPhotoForm } from "@/views/EditView.vue";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePhotoStore = defineStore(
  "photo",
  () => {
    const downloadURL = ref<string[]>([]);

    const list = async () => {
      if (!localStorage.getItem(localStorageKeys.PHOTOS)) {
        await fillDownloadURL();
        const { data, error } = await PhotoService.list();

        if (!data || error) {
          throw new Error(error);
        }

        for (const photo of data) {
          const index = Math.floor(Math.random() * downloadURL.value.length);
          photo.download_url = downloadURL.value[index];
        }

        localStorage.setItem(localStorageKeys.PHOTOS, JSON.stringify(data));
      }

      return getPhotos();
    };

    const fillDownloadURL = async () => {
      const params: ListImagesParams = {
        limit: 100,
      };

      const { data, error } = await PhotoService.listImages(params);

      if (!data || error) {
        throw new Error(error);
      }

      for (const photo of data) {
        downloadURL.value.push(photo.download_url);
      }
    };

    const getPhotos = (): PhotoData[] => {
      const photos = localStorage.getItem(localStorageKeys.PHOTOS);
      return JSON.parse(photos || "[]");
    };

    const removePhoto = async (photoId: number) => {
      const { data, error } = await PhotoService.remove(photoId);

      if (!data || error) {
        throw new Error(error);
      }

      const newPhotos = getPhotos().filter((photo: PhotoData) => photo.id !== photoId);
      localStorage.setItem(localStorageKeys.PHOTOS, JSON.stringify(newPhotos));
    };

    const addPhoto = async (photoData: CreatePhotoForm): Promise<PhotoData> => {
      const { data, error } = await PhotoService.create(photoData);

      if (!data || error) {
        throw new Error(error);
      }

      const photos = getPhotos();
      const lastPhoyo = photos[photos.length - 1];
      const id = Number(lastPhoyo.id) + 1;

      const newPhoto: PhotoData = {
        id,
        albumId: 1,
        title: photoData.title,
        download_url: photoData.download_url,
        url: photoData.download_url,
      };

      photos.push(newPhoto);
      localStorage.setItem(localStorageKeys.PHOTOS, JSON.stringify(photos));

      return newPhoto;
    };

    const editPhoto = async (photoData: EditPhotoForm, photoId: number) => {
      const { data, error } = await PhotoService.update(photoId, photoData);

      if (!data || error) {
        throw new Error(error);
      }

      const photos = getPhotos().map((photo) =>
        photo.id === photoId ? { ...photo, ...photoData } : photo,
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
