// src/components/DailyPlan/hooks/useTours.js
import { useState, useEffect, useCallback } from "react";
import api from "../../../../../api/api";

const useTours = (selectedDate) => {
  const initialTourData = {
    name: "",
    date: selectedDate,
    driver_id: "",
    truck: "",
    trailer: "",
  };
  const [dailyTours, setDailyTours] = useState([]);
  const [editingTour, setEditingTour] = useState(null);
  const [addingTour, setAddingTour] = useState(false);
  const [newTourData, setNewTourData] = useState({
    name: "",
    date: selectedDate,
    driver_id: "",
    truck: "",
    trailer: "",
  });

  const fetchDailyTours = useCallback(async () => {
    try {
      const response = await api.get("/tours", {
        params: { date: selectedDate, expand: "driver" },
      });
      const sortedTours = response.data.sort(
        (a, b) => new Date(a.date) - new Date(b.date) || a.id - b.id
      );
      setDailyTours(sortedTours);
    } catch (error) {
      console.error("Error fetching daily tours:", error);
      setDailyTours([]);
    }
  }, [selectedDate]);

  const handleMoveStop = useCallback(
    async (tourId, stopId, direction) => {
      try {
        const tour = dailyTours.find((t) => t.id === tourId);
        if (!tour) return;

        const stops = [...tour.clients].sort((a, b) => a.order - b.order);
        const currentIndex = stops.findIndex((s) => s.id === stopId);
        const newIndex =
          direction === "up" ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0 || newIndex >= stops.length) return;

        // Swap stops
        [stops[currentIndex], stops[newIndex]] = [
          stops[newIndex],
          stops[currentIndex],
        ];

        // Prepare order updates
        const orderUpdates = stops.map((stop, index) => ({
          id: stop.id,
          order: index,
        }));

        await api.put(`/tours/${tourId}/clients/order`, orderUpdates);
        await fetchDailyTours();
      } catch (error) {
        console.error("Error moving stop:", error);
      }
    },
    [dailyTours, fetchDailyTours]
  );

  const handleDeleteStop = useCallback(
    async (stopId, tourId) => {
      try {
        await api.delete(`/tours/${tourId}/clients/${stopId}`);
        await fetchDailyTours();
      } catch (error) {
        console.error("Error deleting stop:", error);
      }
    },
    [fetchDailyTours]
  );

  const handleAddTour = useCallback(async () => {
    try {
      // Create tour
      const response = await api.post("/tours", {
        name: newTourData.name,
        date: newTourData.date,
        driver_id: newTourData.driver_id || null,
      });

      // Update driver vehicles with full user data
      if (newTourData.driver_id) {
        // First get existing driver data
        const { data: existingDriver } = await api.get(
          `/users/${newTourData.driver_id}`
        );

        // Merge vehicle data with existing driver data
        const updatedDriver = {
          ...existingDriver,
          truck: newTourData.truck || existingDriver.truck,
          trailer: newTourData.trailer || existingDriver.trailer,
        };

        await api.put(`/users/${newTourData.driver_id}`, updatedDriver);
      }

      await fetchDailyTours();
      setAddingTour(false);
      setNewTourData(initialTourData);
    } catch (error) {
      console.error("Error adding tour:", error);
    }
  }, [newTourData, selectedDate, fetchDailyTours]);

  const handleEditTour = useCallback(async () => {
    try {
      await api.put(`/tours/${editingTour.id}`, editingTour);
      if (editingTour.driver_id) {
        await api.patch(`/users/${editingTour.driver_id}`, {
          truck: editingTour.truck,
          trailer: editingTour.trailer,
        });
      }
      await fetchDailyTours();
      setEditingTour(null);
    } catch (error) {
      console.error("Error updating tour:", error);
    }
  }, [editingTour, fetchDailyTours]);

  const handleDeleteTour = useCallback(
    async (tourId) => {
      try {
        await api.delete(`/tours/${tourId}`);
        await fetchDailyTours();
      } catch (error) {
        console.error("Error deleting tour:", error);
      }
    },
    [fetchDailyTours]
  );

  useEffect(() => {
    fetchDailyTours();
  }, [fetchDailyTours]);

  return {
    dailyTours,
    editingTour,
    addingTour,
    newTourData,
    setEditingTour,
    setAddingTour,
    setNewTourData,
    handleAddTour,
    handleEditTour,
    handleDeleteTour,
    fetchDailyTours,
    handleDeleteStop,
    handleMoveStop,
  };
};

export default useTours;
