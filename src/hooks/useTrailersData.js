import { useState, useCallback } from 'react';
import api from '../api/api';
import { useToast } from './useToast';
import { TOAST_SEVERITY } from '../utils/toastUtils';

export const useTrailerData = () => {
  const { showToast } = useToast();
  const [trailers, setTrailers] = useState([]);

  const fetchTrailers = useCallback(async () => {
    try {
      const response = await api.get("/trailers/");
      setTrailers(response.data);
    } catch (error) {
      showToast(
        error.response?.data?.detail || "Error fetching trailers!",
        TOAST_SEVERITY.ERROR
      );
    }
  }, [showToast]);


  return {
    trailers,
    setTrailers,
    fetchTrailers
  };
};