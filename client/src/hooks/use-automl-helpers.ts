// Helper to get upload data from localStorage
export const getUploadData = () => {
    const data = localStorage.getItem("automl_upload_data");
    return data ? JSON.parse(data) : null;
};
