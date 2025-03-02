import { useState, useCallback } from 'react';
import api from '../api/api';
import { useToast } from './useToast';
import { TOAST_SEVERITY } from '../utils/toastUtils';

export const useLoginData = () => {
  const { showToast } = useToast();
  const [selectedUserLogins, setSelectedUserLogins] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const fetchUserLogins = useCallback(async (userId) => {
    try {
      
      if (userId === null) {
        setSelectedUserLogins([]);
        return
      } else {
        const response = await api.get(`/user_logins_history/${userId}`);

      response.data.sort((a, b) => new Date(b.login_time) - new Date(a.login_time));
      setSelectedUserLogins(response.data);
      }
    } catch (error) {
      showToast(
        error.response?.data?.detail || "Error fetching user logins",
        TOAST_SEVERITY.ERROR
      );
    }
  }, [showToast]);

  const handleUserSelect = useCallback((userId) => {
    setSelectedUserId(userId);
    fetchUserLogins(userId);
  }, [fetchUserLogins]);

  return {
    selectedUserLogins,
    selectedUserId,
    handleUserSelect,
  };
};