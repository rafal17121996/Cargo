import { useState, useCallback } from 'react';
import api from '../api/api';
import { useToast } from './useToast';
import { TOAST_SEVERITY } from '../utils/toastUtils';

export const useTemplateToursData = () => {
    const { showToast } = useToast();
    const [templateTours, setTemplateTours] = useState([]);
    
    const fetchTemplateTours = useCallback(async () => {
        try {
            const response = await api.get("/tour-templates/");
            setTemplateTours(response.data);
        } catch (error) {
        showToast(
            error.response?.data?.detail || "Error fetching template tours!",
            TOAST_SEVERITY.ERROR
        );
        }
    }, [showToast]);

    return {
        templateTours,
        setTemplateTours,
        fetchTemplateTours
    };
};