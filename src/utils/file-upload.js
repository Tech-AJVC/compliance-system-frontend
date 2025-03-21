import { apiWithAuth } from "./api";

export default function fileUpload(file, category) {
  if (!file || !file.name) {
    console.error("Invalid file or file name");
    return Promise.reject(new Error("Invalid file or file name"));
  }

  try {
    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("file", file);
    formData.append("category", category);

    return apiWithAuth.post("/api/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (error) {
    console.error("File upload failed:", error);
    return Promise.reject(error);
  }
}
