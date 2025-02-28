import type { CreatePhotoForm } from "@/views/AddView.vue";
import { http, httpImages } from "../http";
import axios from "axios";
import type { EditPhotoForm } from "@/views/EditView.vue";

export interface PhotoData {
  id: number;
  albumId: number;
  title: string;
  url: string;
  download_url: string;
}

export interface ImageData {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

export type ListImagesParams = {
  limit: number;
};

export default class PhotoService {
  static async list() {
    try {
      const data = await http.get<PhotoData[]>("/photos");

      return { data: data.data, error: null };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return { data: null, error: error.response.data?.message || "Erro desconhecido" };
      }

      return { data: null, error: "Erro desconhecido" };
    }
  }

  static async remove(photoId: number) {
    try {
      const data = await http.delete<void>(`/photos/${photoId}`);

      return { data: data.data, error: null };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return { data: null, error: error.response.data?.message || "Erro desconhecido" };
      }

      return { data: null, error: "Erro desconhecido" };
    }
  }

  static async update(photoId: number, body: EditPhotoForm) {
    try {
      const data = await http.put<void>(`/photos/${photoId}`, { body });

      return { data: data.data, error: null };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return { data: null, error: error.response.data?.message || "Erro desconhecido" };
      }

      return { data: null, error: "Erro desconhecido" };
    }
  }

  static async create(body: CreatePhotoForm) {
    try {
      const data = await http.post<void>("/photos", { body });

      return { data: data.data, error: null };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return { data: null, error: error.response.data?.message || "Erro desconhecido" };
      }

      return { data: null, error: "Erro desconhecido" };
    }
  }

  static async listImages(params: ListImagesParams) {
    try {
      const data = await httpImages.get<ImageData[]>("/list", { params });

      return { data: data.data, error: null };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return { data: null, error: error.response.data?.message || "Erro desconhecido" };
      }

      return { data: null, error: "Erro desconhecido" };
    }
  }
}
