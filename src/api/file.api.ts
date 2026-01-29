import type { IFile, PatchedFile, UploadedFile } from "@/stores/useFileStore";
import { Api } from "./api";

//PUBLIC
export const getPublicFiles = async (): Promise<IFile[]> => {
  const { data } = await Api.get<{ files: IFile[] }>("/files/public");

  return data.files;
};

export const getPublicFilePreview = async (id: string): Promise<Blob> => {
  const { data } = await Api.get<Blob>(`/files/public/preview/${id}`, {
    responseType: "blob",
  });

  return data;
};

//USER
export const getUserFiles = async (): Promise<IFile[]> => {
  const { data } = await Api.get<{ files: IFile[] }>("/files/user");

  return data.files;
};

export const getUserFilePreview = async (id: string): Promise<Blob> => {
  const { data } = await Api.get<Blob>(`/files/preview/${id}`, {
    responseType: "blob",
  });

  return data;
};

//ALL
export const uploadFile = async (file: File): Promise<IFile> => {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await Api.post<UploadedFile>("/files/upload", formData);

  return data.file;
};

export const downloadFile = async (id: string): Promise<Blob> => {
  const { data } = await Api.get<Blob>(`/files/download/${id}`, {
    responseType: "blob",
  });

  return data;
};

export interface DeleteFile {
  message: string;
}

export const deleteFile = async (id: string): Promise<DeleteFile> => {
  const { data } = await Api.delete<DeleteFile>(`/files/delete/${id}`);

  return data;
};

export interface PatchFile {
  isPublic?: boolean;
  originalname?: string;
}

export const patchFile = async (
  id: string,
  payload: PatchFile,
): Promise<PatchedFile> => {
  const { data } = await Api.patch<{ file: PatchedFile }>(
    `/files/update/${id}`,
    payload,
  );

  return data.file;
};
