"use client";

type LocalStorageKey =
  | 'organizationId'
  | 'accessToken'
  | 'refreshToken'
  | 'focusedOrganizationId';

export function useLocalStorage() {
  const getValueFromLocalStorage = <T = any>(key: LocalStorageKey): T | null => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
      return JSON.parse(raw);
    } catch {
      return raw as any;
    }
  };

  const setValueInLocalStorage = (key: LocalStorageKey, value: any) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  };

  const removeValue = (key: LocalStorageKey) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  };

   const removeAllValue = () => {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  };

  return { getValueFromLocalStorage: getValueFromLocalStorage, setValueInLocalStorage: setValueInLocalStorage, removeValue , removeAllValue} as const;
}
