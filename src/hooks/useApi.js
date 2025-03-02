import { useState, useCallback } from 'react';
import api from '../api/api';

function useApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = useCallback(async ({ url, method = 'GET', payload = null }) => {
  
    setLoading(true);
    try {
      const response = await api({
        url,
        method,
        data: payload,
      });
      setData(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}

export default useApi;
