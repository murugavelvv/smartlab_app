import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useMemo } from 'react';

export const [StorageProvider, useStorage] = createContextHook(() => {
  const storage = useMemo(() => ({
    setItem: async (key: string, value: string) => {
      if (!key?.trim() || key.length > 100) return;
      const sanitizedKey = key.trim();
      await AsyncStorage.setItem(sanitizedKey, value);
    },
    getItem: async (key: string) => {
      if (!key?.trim() || key.length > 100) return null;
      const sanitizedKey = key.trim();
      return await AsyncStorage.getItem(sanitizedKey);
    },
    removeItem: async (key: string) => {
      if (!key?.trim() || key.length > 100) return;
      const sanitizedKey = key.trim();
      await AsyncStorage.removeItem(sanitizedKey);
    },
    multiRemove: async (keys: string[]) => {
      const sanitizedKeys = keys.filter(key => key?.trim() && key.length <= 100).map(key => key.trim());
      await AsyncStorage.multiRemove(sanitizedKeys);
    },
  }), []);

  return storage;
});