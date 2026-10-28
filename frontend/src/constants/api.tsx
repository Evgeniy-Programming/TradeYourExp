// По умолчанию API берётся с того же origin через прокси Vite (см. vite.config.ts),
// поэтому HttpOnly-cookie с токенами работают без CORS.
export const baseURL = import.meta.env.VITE_API_URL || '/api/v1/';
