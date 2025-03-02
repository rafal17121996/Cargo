import { useState, useCallback } from 'react';
import api from '../api/api';
import { useToast } from './useToast';
import { TOAST_SEVERITY } from '../utils/toastUtils';

export const useRolesData = () => {
  const { showToast } = useToast();
  const [roles, setRoles] = useState([]);

  const fetchRoles = useCallback(async () => {
    try {
      const response = await api.get("/roles/");
      setRoles(response.data);
    } catch (error) {
      showToast(
        error.response?.data?.detail || "Error fetching roles!",
        TOAST_SEVERITY.ERROR
      );
    }
  }, [showToast]);


  return {
    roles,
    setRoles,
    fetchRoles
  };
};