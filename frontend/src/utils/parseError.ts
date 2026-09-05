import axios from 'axios';
import type { IErrorMessage } from '../types/error';

export const parseError = (error: unknown): IErrorMessage => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    'status' in error &&
    typeof error.message === 'string' &&
    typeof error.message === 'number'
  ) {
    return error as IErrorMessage;
  }

  if (axios.isAxiosError(error)) {
    return {
      message: error.response?.data.message || error.message,
      status: error.response?.status,
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'Неизвестная ошибка' };
};
