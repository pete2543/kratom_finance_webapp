import { apiGet, apiUpload } from "./client";

export type ObjectDocument = {
  id: number;
  etag: string;
  bucket: string;
  folder1: string;
  full_path: string;
  file_name: string;
  content_type: string;
  content_size: string;
  file_extention: string;
  object_name: string;
  table_name: string;
  table_id: number;
  created_date: string;
  public_url: string;
};

export type UploadObjectDocumentInput = {
  file: File | Blob;
  fileName?: string;
  folder1: string;
  table_name: string;
  table_id: number | string;
};

export type ObjectDocumentSignedUrl = {
  url: string;
};

export const objectDocumentsApi = {
  upload(input: UploadObjectDocumentInput) {
    const formData = new FormData();
    formData.append(
      "file",
      input.file,
      input.fileName ?? (input.file instanceof File ? input.file.name : "upload"),
    );
    formData.append("folder1", input.folder1);
    formData.append("table_name", input.table_name);
    formData.append("table_id", String(input.table_id));

    return apiUpload<ObjectDocument>("/object-documents/upload", formData);
  },

  getById(id: number) {
    return apiGet<ObjectDocument>(`/object-documents/${id}`);
  },

  getSignedUrl(id: number) {
    return apiGet<ObjectDocumentSignedUrl>(`/object-documents/${id}/signed-url`);
  },
};
