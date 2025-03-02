import { useCallback } from "react";
import api from "../api/api";
import { useToast } from "./useToast";
import { TOAST_SEVERITY } from "../utils/toastUtils";

export const useTruckActions = (
  setTrucks,
) => {
  const { showToast } = useToast();

  const handleSave = useCallback(
    async (editingTruck, truckData) => {
      try {
        if (editingTruck) {
          const res = await api.put(`/trucks/${editingTruck.id}`, truckData);
          setTrucks((prev) =>
            prev.map((u) => (u.id === res.data.id ? res.data : u))
          );
        } else {
          const res = await api.post(`/trucks/`, truckData);
          setTrucks((prev) => [...prev, res.data]);
        }
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to save truck",
          TOAST_SEVERITY.ERROR
        );
        return false;
      }
    },
    [setTrucks, showToast]
  );

  const confirmDelete = useCallback(
    async (deleteTruckId) => {
      try {
        await api.delete(`/trucks/${deleteTruckId}`);
        setTrucks((prev) => prev.filter((u) => u.id !== deleteTruckId));
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to delete truck",
          TOAST_SEVERITY.ERROR
        );
        return false;
      }
    },
    [setTrucks, showToast]
  );

  return {
    handleSave,
    confirmDelete,
  };
};
