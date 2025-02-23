import { http } from "../http";
import axios from "axios";

export interface PhotoData {
  id: string;
  author: string;
  description: string;
  width?: number;
  height?: number;
  url: string;
  download_url: string;
}

export interface ListPhotosParams {
  page: number;
  limit: number;
}

export default class PhotoService {
  static async list(params: ListPhotosParams) {
    try {
      const data = await http.get<PhotoData[]>("/list", { params });
      console.log(data.data);

      return { data: data.data, error: null };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return { data: null, error: error.response.data?.message || "Erro desconhecido" };
      }

      return { data: null, error: "Erro desconhecido" };
    }
  }
}
