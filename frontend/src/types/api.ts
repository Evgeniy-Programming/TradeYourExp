// Общий формат ответа бэкенда (backend/internal/models/response.go)
export interface IApiResponse<T> {
  request_id: string;
  status: boolean;
  message?: string;
  result: T;
}
