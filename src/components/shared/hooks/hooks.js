import { useState } from 'react';

function useLocalStorage(key, value) {
  const storageData = localStorage.getItem(key);
  const defaultValue = storageData ? JSON.parse(storageData) : value;
  const [state, setState] = useState(defaultValue);

  const writeData = val => {
    const data = typeof val === 'function' ? val() : val;
    localStorage.setItem(key, JSON.stringify(data));
    setState(val);
  };

  return [state, writeData];
}

export { useLocalStorage };
