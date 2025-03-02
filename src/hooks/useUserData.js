import { useEffect, useState } from 'react';

const useUserData = () => {
  const [userData, setUserData] = useState(() => {
    const storedData = sessionStorage.getItem('userData');
    console.log('Initial stored userData:', storedData);
    return storedData ? JSON.parse(storedData) : { name: 'User', role: 'Dispatcher' };
  });

  useEffect(() => {
    const handleStorage = () => {
      const storedData = sessionStorage.getItem('userData');
      console.log('Updated stored userData:', storedData);
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const clearUserData = () => {
    sessionStorage.removeItem('userData');
    console.log('User data cleared. Reset to default.');
    setUserData({ name: 'User', role: 'Dispatcher' });
  };

  return { userData, clearUserData };
};

export default useUserData;
