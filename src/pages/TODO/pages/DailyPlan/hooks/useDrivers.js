// src/components/DailyPlan/hooks/useDrivers.js
import { useState, useEffect, useCallback } from 'react';
import api from '../../../../../api/api';

const useDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      const driversData = response.data.filter(user => !user.is_dispatcher);
      setDrivers(driversData);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch drivers');
      console.error('Error fetching drivers:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDriverVehicle = useCallback(async (driverId, vehicleData) => {
    try {
      setLoading(true);
      await api.patch(`/users/${driverId}`, vehicleData);
      setDrivers(prev => prev.map(driver => 
        driver.id === driverId ? { ...driver, ...vehicleData } : driver
      ));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update driver');
      console.error('Error updating driver:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  return {
    drivers,
    loading,
    error,
    fetchDrivers,
    updateDriverVehicle
  };
};

export default useDrivers;