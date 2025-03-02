import { useCallback } from "react";
import api from "../api/api";
import { useToast } from "./useToast";
import { TOAST_SEVERITY } from "../utils/toastUtils";

export const useTemplateTourActions = (
    setTemplateTours,
    fetchTemplateTours
    ) => {
    const { showToast } = useToast();
    
    const handleSaveTemplateTour = useCallback(
        async (editingTemplateTour, templateTourData) => {
        try {
            if (editingTemplateTour) {
            const res = await api.put(`/tour-templates/${editingTemplateTour.id}`, templateTourData);
            setTemplateTours((prev) =>
                prev.map((u) => (u.id === res.data.id ? res.data : u))
            );
            } else {
            const res = await api.post(`/tour-templates/`, templateTourData);
            setTemplateTours((prev) => [...prev, res.data]);
            }
            return true;
        } catch (err) {
            showToast(
            err.response?.data?.detail || "Failed to save template tour",
            TOAST_SEVERITY.ERROR
            );
            return false;
        }
        },
        [setTemplateTours, showToast]
    );

    const handleSaveTemplateTourStop = useCallback(
        async (editingTemplateTour, editingTemplateTourStop, templateTourStopData) => {
        try {
            const cleanedData = {
                ...templateTourStopData,
                planned_arrival: templateTourStopData.planned_arrival || null,
                planned_departure: templateTourStopData.planned_departure || null
              };

            if (editingTemplateTourStop) {
            const res = await api.put(`/tour-templates/${editingTemplateTour.id}/stops/${editingTemplateTourStop.id}`, cleanedData);
            setTemplateTours((prev) =>
                prev.map((u) => {   
                    if (u.id === editingTemplateTour.id) {
                        return {
                            ...u,
                            stops: u.stops.map((s) => (s.id === res.data.id ? res.data : s))
                        };
                    }
                    return u;
                }
            ));
            } else {
            const res = await api.post(`/tour-templates/${editingTemplateTour.id}/stops`, templateTourStopData);
            setTemplateTours((prev) =>
                prev.map((u) => {
                    if (u.id === editingTemplateTour.id) {
                        return {
                            ...u,
                            stops: [...u.stops, res.data]
                        };
                    }
                    return u;
                }
            ));
            }
            return true;
        } catch (err) {
            showToast(
            err.response?.data?.detail || "Failed to save template tour stop",
            TOAST_SEVERITY.ERROR
            );
            return false;
        }
        },
        [setTemplateTours, showToast]
    );
    
    const confirmDeleteTemplateTour = useCallback(
        async (deleteTemplateTourId) => {
        try {
            await api.delete(`/tour-templates/${deleteTemplateTourId}`);
            setTemplateTours((prev) => prev.filter((u) => u.id !== deleteTemplateTourId));
            return true;
        } catch (err) {
            showToast(
            err.response?.data?.detail || "Failed to delete template tour",
            TOAST_SEVERITY.ERROR
            );
            return false;
        }
        },
        [setTemplateTours, showToast]
    );

    const confirmDeleteTemplateTourStop = useCallback(
        async (deleteTemplateTourStopId, templateTourId) => {
        try {
            await api.delete(`/tour-templates/${templateTourId}/stops/${deleteTemplateTourStopId}`);
            setTemplateTours((prev) => prev.map((u) => {
                if (u.id === templateTourId) {
                    return {
                        ...u,
                        stops: u.stops.filter((s) => s.id !== deleteTemplateTourStopId)
                    };
                }
                return u;
            }));
            return true;
        } catch (err) {
            showToast(
            err.response?.data?.detail || "Failed to delete template tour stop",
            TOAST_SEVERITY.ERROR
            );
            return false;
        }
    },
    [setTemplateTours, showToast]);

    const handleMoveStop = useCallback(
        async (templateTour, templateTourStop, direction) => {
          if (!templateTour || !templateTourStop) return false;
    
          try {
            const currentOrder = templateTourStop.order;
            const newOrder =
              direction === "up" ? currentOrder - 1 : currentOrder + 1;
    
            if (newOrder < 0) {
              console.warn("Cannot move stop any further up, order cannot be negative.");
              return false;
            }
    
            await api.put(
              `/tour-templates/${templateTour.id}/stops/${templateTourStop.id}`,
              { order: newOrder }
            );

            await fetchTemplateTours();
    
            return true;
          } catch (err) {
            showToast(
              err.response?.data?.detail || "Failed to move template tour stop",
              TOAST_SEVERITY.ERROR
            );
            return false;
          }
        },
        [showToast, fetchTemplateTours]
      );
    
    
    return {
        handleSaveTemplateTour,
        handleSaveTemplateTourStop,
        confirmDeleteTemplateTour,
        confirmDeleteTemplateTourStop,
        handleMoveStop
    };
    }