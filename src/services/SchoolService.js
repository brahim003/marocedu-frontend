import axios from 'axios';

// حيت عندك proxy فـ vite.config.js، كنخدمو بـ /api نيشان
const API_URL = "/api/schools"; 

export const createSchool = async (schoolData, logoFile) => {
    const formData = new FormData();

    // كنعمرو البيانات
    formData.append("name", schoolData.name);
    formData.append("city", schoolData.city);
    formData.append("slug", schoolData.slug);

    // كنزيدو اللوغو إلا ختاريتيه
    if (logoFile) {
        formData.append("image", logoFile);
    }

    // كنصيفطو الطلب (Multipart)
    return axios.post(API_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" }
    });
};

export const getAllSchools = async () => {
    return axios.get(API_URL);
};

export const deleteSchool = async (id) => {
    return axios.delete(`${API_URL}/id/${id}`);
};