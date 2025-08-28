import axiosInstance, { endpoints } from "src/lib/axios";

export function uploadImage(file: File, folder: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('Folder', folder);

    return axiosInstance.post(endpoints.upload.uploadImage, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}

export function uploadMultipleImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file, index) => {
        formData.append(`files[${index}]`, file);
    });

    return axiosInstance.post(endpoints.upload.uploadMultipleImages, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}