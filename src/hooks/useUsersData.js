import { useState, useCallback } from 'react';
import api from '../api/api';
import { useToast } from './useToast';
import { TOAST_SEVERITY } from '../utils/toastUtils';

export const useUsersData = () => {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [trailers, setTrailers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [lastLogins, setLastLogins] = useState([]);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await api.get("/users/");
      setUsers(response.data);
    } catch (error) {
      showToast(
        error.response?.data?.detail || "Error fetching users!",
        TOAST_SEVERITY.ERROR
      );
    }
  }, [showToast]);

  const fetchDropdownData = useCallback(async () => {
    try {
      const [trucksRes, trailersRes, rolesRes] = await Promise.all([
        api.get("/trucks/"),
        api.get("/trailers/"),
        api.get("/roles/"),
      ]);
      setTrucks(trucksRes.data);
      setTrailers(trailersRes.data);
      setRoles(rolesRes.data);
    } catch (error) {
      showToast(
        error.response?.data?.detail || "Error loading dropdown data!",
        TOAST_SEVERITY.ERROR
      );
    }
  }, [showToast]);

  const fetchLastLogins = useCallback(async () => {
    try {
      const response = await api.get("/user_logins_history/");
      setLastLogins(response.data);
    } catch (error) {
      showToast(
        error.response?.data?.detail || "Error fetching login history",
        TOAST_SEVERITY.ERROR
      );
    }
  }, [showToast]);

  return {
    users,
    trucks,
    trailers,
    roles,
    lastLogins,
    setUsers,
    fetchUsers,
    fetchDropdownData,
    fetchLastLogins
  };
};