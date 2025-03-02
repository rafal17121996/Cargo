import { useCallback } from "react";
import api from "../api/api";
import { useToast } from "./useToast";
import { TOAST_SEVERITY } from "../utils/toastUtils";

export const useUserActions = (
  setUsers,
  setTempPassword,
  setResetConfirmOpen,
  setTempPasswordOpen
) => {
  const { showToast } = useToast();

  const handleSave = useCallback(
    async (editingUser, userData) => {
      try {
        if (editingUser) {
          const res = await api.put(`/users/${editingUser.id}`, userData);
          setUsers((prev) =>
            prev.map((u) => (u.id === res.data.id ? res.data : u))
          );
        } else {
          const res = await api.post(`/users/`, userData);
          setUsers((prev) => [...prev, res.data]);
          setTempPassword(res.data.temporary_password);
            setTempPasswordOpen(true);
        }
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to save user",
          TOAST_SEVERITY.ERROR
        );
        return false;
      }
    },
    [setUsers, setTempPassword, setTempPasswordOpen, showToast]
  );

  const confirmDelete = useCallback(
    async (deleteUserId) => {
      try {
        await api.delete(`/users/${deleteUserId}`);
        setUsers((prev) => prev.filter((u) => u.id !== deleteUserId));
        return true;
      } catch (err) {
        showToast(
          err.response?.data?.detail || "Failed to delete user",
          TOAST_SEVERITY.ERROR
        );
        return false;
      }
    },
    [setUsers, showToast]
  );

  const confirmPasswordReset = useCallback(
    async (resetUser) => {
      try {
        const res = await api.post(`/users/${resetUser.id}/reset-password`);
        setTempPassword(res.data.temporary_password);
        setResetConfirmOpen(false);
        setTempPasswordOpen(true);
        return true;
      } catch (error) {
        showToast(
          error.response?.data?.detail || "Error resetting password",
          TOAST_SEVERITY.ERROR
        );
        return false;
      }
    },
    [setTempPassword, setResetConfirmOpen, setTempPasswordOpen, showToast]
  );

  return {
    handleSave,
    confirmDelete,
    confirmPasswordReset,
  };
};
