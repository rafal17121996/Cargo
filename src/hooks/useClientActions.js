import { useCallback } from "react";
import api from "../api/api";
import { useToast } from "./useToast";
import { TOAST_SEVERITY } from "../utils/toastUtils";

export const useClientActions = (
  setClients,
) => {
  const { showToast } = useToast();

  const handleSave = useCallback(
    async (editingClient, clientData) => {
      try {
        if (editingClient) {
          const res = await api.put(`/clients/${editingClient.id}`, clientData);
          setClients((prev) =>
            prev.map((u) => (u.id === res.data.id ? res.data : u))
          );
        } else {
          const res = await api.post(`/clients/`, clientData);
          setClients((prev) => [...prev, res.data]);
        }
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to save client",
          TOAST_SEVERITY.ERROR
        );
        return false;
      }
    },
    [setClients, showToast]
  );

  const confirmDelete = useCallback(
    async (deleteClientId) => {
      try {
        await api.delete(`/clients/${deleteClientId}`);
        setClients((prev) => prev.filter((u) => u.id !== deleteClientId));
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to delete client",
          TOAST_SEVERITY.ERROR
        );
        return false;
      }
    },
    [setClients, showToast]
  );

  return {
    handleSave,
    confirmDelete,
  };
};
