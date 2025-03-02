import { useState } from 'react';

export const useLoginForm = (initialState = { username: '', password: '' }) => {
  const [credentials, setCredentials] = useState(initialState);

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  return {
    credentials,
    handleChange,
    setCredentials
  };
};