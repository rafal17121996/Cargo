import { useState, useCallback } from 'react';
import api from '../api/api';
import { useToast } from './useToast';
import { TOAST_SEVERITY } from '../utils/toastUtils';

export const useTruckData = () => {
  const { showToast } = useToast();
  const [trucks, setTrucks] = useState([]);

  const fetchTrucks = useCallback(async () => {
    try {
      const response = await api.get("/trucks/");
      setTrucks(response.data);
    } catch (error) {
      showToast(
        error.response?.data?.detail || "Error fetching trucks!",
        TOAST_SEVERITY.ERROR
      );
    }
  }, [showToast]);


  return {
    trucks,
    setTrucks,
    fetchTrucks
  };
};