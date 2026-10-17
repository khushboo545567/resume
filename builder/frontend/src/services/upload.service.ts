import api from "../api/axios";

export interface UploadPhotoResponse {
  success: boolean;
  message: string;
  photo: {
    publicId: string;
    url: string;
  };
}

export async function uploadProfilePhoto(file: File) {
  const formData = new FormData();

  formData.append("photo", file);

  const { data } = await api.post<UploadPhotoResponse>(
    "/upload/profile-photo",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data.photo;
}