const API_URL = import.meta.env.VITE_API_URL_UPLOADS_PATH;

export const getImageUrl = (photo) => {
    if (!photo) return '';
    if (photo.url.startsWith('http')) return photo.url;
    return `${API_URL}/uploads/${photo.url.split('/').pop()}`;
  };