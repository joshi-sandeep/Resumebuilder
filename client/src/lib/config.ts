export const API_URL = import.meta.env.PROD 
  ? '/.netlify/functions/api'  // Use full path in production
  : '/api';  // Use relative path in development

export const getApiUrl = (path: string) => `${API_URL}${path}`;