import { useState, useCallback } from 'react';
import api from '../api/api';
import { useToast } from './useToast';
import { TOAST_SEVERITY } from '../utils/toastUtils';

export const useClientsData = () => {
  const { showToast } = useToast();
  const [clients, setClients] = useState([]);

  const fetchClients = useCallback(async () => {
    try {
      const response = await api.get("/clients/");
      setClients(response.data);
    } catch (error) {
      showToast(
        error.response?.data?.detail || "Error fetching clients!",
        TOAST_SEVERITY.ERROR
      );
    }
  }, [showToast]);

  const renderClientAddress = (client) => {
    if (!client) return "";
    const { street, house_number, postal_code, city, country } = client;
    return `${street || ""} ${house_number || ""}, ${postal_code || ""} ${
      city || ""
    }, ${country || ""}`;
  };
  


  return {
    clients,
    setClients,
    fetchClients,
    renderClientAddress
  };
};

