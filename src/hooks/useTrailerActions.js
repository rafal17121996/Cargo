import { useCallback } from "react";
import api from "../api/api";
import { useToast } from "./useToast";
import { TOAST_SEVERITY } from "../utils/toastUtils";

export const useTrailerActions = (
  setTrailers,
) => {
  const { showToast } = useToast();

  const handleSave = useCallback(
    async (editingTrailer, trailerData) => {
      try {
        if (editingTrailer) {
          const res = await api.put(`/trailers/${editingTrailer.id}`, trailerData);
          setTrailers((prev) =>
            prev.map((u) => (u.id === res.data.id ? res.data : u))
          );
        } else {
          const res = await api.post(`/trailers/`, trailerData);
          setTrailers((prev) => [...prev, res.data]);
        }
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to save trailer",
          TOAST_SEVERITY.ERROR
        );
        return false;
      }
    },
    [setTrailers, showToast]
  );

  const confirmDelete = useCallback(
    async (deleteTrailerId) => {
      try {
        await api.delete(`/trailers/${deleteTrailerId}`);
        setTrailers((prev) => prev.filter((u) => u.id !== deleteTrailerId));
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to delete trailer",
          TOAST_SEVERITY.ERROR
        );
        return false;
      }
    },
    [setTrailers, showToast]
  );

  return {
    handleSave,
    confirmDelete,
  };
};
