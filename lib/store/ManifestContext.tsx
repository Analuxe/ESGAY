'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface ManifestItem {
  id: string;
  title: string;
  price: number;
  vendor: string;
}

interface ManifestContextType {
  items: ManifestItem[];
  addItem: (item: ManifestItem) => void;
  removeItem: (id: string) => void;
  total: number;
}

const ManifestContext = createContext<ManifestContextType | undefined>(undefined);

export function ManifestProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ManifestItem[]>([]);

  const addItem = (item: ManifestItem) => {
    setItems((prev) => {
      // Prevent duplicates for now, assuming unique artifacts
      if (prev.find((i) => i.id === item.id)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <ManifestContext.Provider value={{ items, addItem, removeItem, total }}>
      {children}
    </ManifestContext.Provider>
  );
}

export function useManifest() {
  const context = useContext(ManifestContext);
  if (context === undefined) {
    throw new Error('useManifest must be used within a ManifestProvider');
  }
  return context;
}
