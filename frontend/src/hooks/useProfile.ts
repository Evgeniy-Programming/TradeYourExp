import { useEffect } from 'react';
import { authAPI } from '../api/auth';
import { useAppDispatch } from './useAppDispatch';
import { setErrorWithTimeout } from '../store/slices/appSlice';
import { setProfile } from '../store/slices/profileSlice';

export const useProfile = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await authAPI.getMe();
        dispatch(setProfile(response.data.data));
      } catch (error) {
        dispatch(setErrorWithTimeout(error));
      }
    };

    getProfile();
  }, [dispatch]);
};
