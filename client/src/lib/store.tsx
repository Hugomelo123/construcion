import React, { createContext, useContext, useState } from 'react';
import { Material, Labor, Template, Quote, QuoteItem, QuoteSection } from './types';
import { MOCK_MATERIALS, MOCK_LABOR, SYSTEM_TEMPLATES, MOCK_QUOTES } from './mockData';

type AppContextType = {
  materials: Material[];
  labor: Labor[];
  templates: Template[];
  quotes: Quote[];
  addQuote: (quote: Quote) => void;
  updateQuote: (id: string, quote: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  addMaterial: (material: Material) => void;
  deleteMaterial: (id: string) => void;
  // Add other CRUD actions as needed
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);
  const [labor, setLabor] = useState<Labor[]>(MOCK_LABOR);
  const [templates, setTemplates] = useState<Template[]>(SYSTEM_TEMPLATES);
  const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);

  const addQuote = (quote: Quote) => {
    setQuotes((prev) => [quote, ...prev]);
  };

  const updateQuote = (id: string, updates: Partial<Quote>) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates, updated_at: new Date().toISOString() } : q))
    );
  };

  const deleteQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  const addMaterial = (material: Material) => {
    setMaterials((prev) => [...prev, material]);
  };

  const deleteMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        materials,
        labor,
        templates,
        quotes,
        addQuote,
        updateQuote,
        deleteQuote,
        addMaterial,
        deleteMaterial,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within a AppProvider');
  }
  return context;
}
