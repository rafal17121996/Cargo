import { useCallback } from "react";
import api from "../api/api";
import { useToast } from "./useToast";
import { TOAST_SEVERITY } from "../utils/toastUtils";

export const useRoleActions = (
  setRoles,
) => {
  const { showToast } = useToast();

  const handleSave = useCallback(
    async (editingRole, roleData) => {
      try {
        if (editingRole) {
          const res = await api.put(`/roles/${editingRole.id}`, roleData);
          setRoles((prev) =>
            prev.map((u) => (u.id === res.data.id ? res.data : u))
          );
        } else {
          const res = await api.post(`/roles/`, roleData);
          setRoles((prev) => [...prev, res.data]);
        }
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to save role",
          TOAST_SEVERITY.ERROR
        );
        return false;
      }
    },
    [setRoles, showToast]
  );

  const confirmDelete = useCallback(
    async (deleteRoleId) => {
      try {
        await api.delete(`/roles/${deleteRoleId}`);
        setRoles((prev) => prev.filter((u) => u.id !== deleteRoleId));
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to delete role",
          TOAST_SEVERITY.ERROR
        );
        return false;
      }
    },
    [setRoles, showToast]
  );

  return {
    handleSave,
    confirmDelete,
  };
};
