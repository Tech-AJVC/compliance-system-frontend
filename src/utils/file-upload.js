import { documentApiPaths } from "@/constant/apiPaths";
import { apiWithAuth } from "./api";

export default function fileUpload(file, category, task_id ){
  if (!file || !file.name) {
    console.error("Invalid file or file name");
    return Promise.reject(new Error("Invalid file or file name"));
  }

  try {
    const formData = new FormData();
    formData.append("name", file.name);
    formData.append("file", file);
    formData.append("category", category);
    formData.append("task_id", task_id);
    return apiWithAuth.post(documentApiPaths.uploadDocument, formData, {
      headers: {
      "Content-Type": "multipart/form-data",
      },
      timeout: 0,
    });
  } catch (error) {
    console.error("File upload failed:", error);
    return Promise.reject(error);
  }
}
