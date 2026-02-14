import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Material, Labor, Template, Quote } from './types';
import { MOCK_MATERIALS, MOCK_LABOR, SYSTEM_TEMPLATES, MOCK_QUOTES } from './mockData';
import { apiRequest } from './queryClient';

type AppContextType = {
  materials: Material[];
  labor: Labor[];
  templates: Template[];
  quotes: Quote[];
  settings: CompanySettings;
  loading: boolean;
  addQuote: (quote: Quote) => Promise<void>;
  updateQuote: (id: string, quote: Partial<Quote>) => Promise<void>;
  deleteQuote: (id: string) => Promise<void>;
  addMaterial: (material: Material) => Promise<void>;
  updateMaterial: (id: string, material: Partial<Material>) => Promise<void>;
  deleteMaterial: (id: string) => Promise<void>;
  addLabor: (labor: Labor) => Promise<void>;
  updateLabor: (id: string, labor: Partial<Labor>) => Promise<void>;
  deleteLabor: (id: string) => Promise<void>;
  addTemplate: (template: Template) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  updateSettings: (settings: Partial<CompanySettings>) => Promise<void>;
  refreshData: () => Promise<void>;
};

export type CompanySettings = {
  company_name: string;
  company_address: string;
  company_nif: string;
  company_email: string;
  company_phone: string;
  default_iva: number;
  default_validity_days: number;
  default_payment_conditions: string;
};

const defaultSettings: CompanySettings = {
  company_name: 'LuxBuild Construction Sàrl',
  company_address: '123 Route d\'Arlon, L-8008 Strassen',
  company_nif: 'LU12345678',
  company_email: 'contact@luxbuild.lu',
  company_phone: '+352 691 123 456',
  default_iva: 17,
  default_validity_days: 30,
  default_payment_conditions: '30% acompte, 30% démarrage, 30% avancement, 10% réception',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [materials, setMaterials] = useState<Material[]>(MOCK_MATERIALS);
  const [labor, setLabor] = useState<Labor[]>(MOCK_LABOR);
  const [templates, setTemplates] = useState<Template[]>(SYSTEM_TEMPLATES);
  const [quotes, setQuotes] = useState<Quote[]>(MOCK_QUOTES);
  const [settings, setSettings] = useState<CompanySettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [apiAvailable, setApiAvailable] = useState(false);

  // Map API quote to frontend Quote type
  function mapApiQuote(q: any): Quote {
    return {
      ...q,
      sections: Array.isArray(q.sections) ? q.sections : [],
      created_at: q.created_at || new Date().toISOString(),
      total_materials: q.total_materials ?? 0,
      total_labor: q.total_labor ?? 0,
      subtotal: q.subtotal ?? 0,
      discount_amount: q.discount_amount ?? 0,
      iva_amount: q.iva_amount ?? 0,
      total: q.total ?? 0,
      discount_percentage: q.discount_percentage ?? 0,
      iva_rate: q.iva_rate ?? 17,
      validity_days: q.validity_days ?? 30,
    };
  }

  // Try to load data from API, fall back to mock data
  const refreshData = useCallback(async () => {
    try {
      const [matRes, labRes, tplRes, quotRes] = await Promise.all([
        fetch('/api/materials', { credentials: 'include' }),
        fetch('/api/labor', { credentials: 'include' }),
        fetch('/api/templates', { credentials: 'include' }),
        fetch('/api/quotes', { credentials: 'include' }),
      ]);

      if (matRes.ok && labRes.ok && tplRes.ok && quotRes.ok) {
        setApiAvailable(true);
        const [matData, labData, tplData, quotData] = await Promise.all([
          matRes.json(), labRes.json(), tplRes.json(), quotRes.json(),
        ]);

        setMaterials(matData.length > 0 ? matData : MOCK_MATERIALS);
        setLabor(labData.length > 0 ? labData : MOCK_LABOR);
        setTemplates(tplData.length > 0 ? tplData : SYSTEM_TEMPLATES);
        setQuotes(quotData.length > 0 ? quotData.map(mapApiQuote) : MOCK_QUOTES);
      }

      // Try loading user settings
      const meRes = await fetch('/api/auth/me', { credentials: 'include' });
      if (meRes.ok) {
        const user = await meRes.json();
        if (user.company_name) {
          setSettings({
            company_name: user.company_name || defaultSettings.company_name,
            company_address: user.company_address || defaultSettings.company_address,
            company_nif: user.company_nif || defaultSettings.company_nif,
            company_email: user.company_email || defaultSettings.company_email,
            company_phone: user.company_phone || defaultSettings.company_phone,
            default_iva: user.default_iva ?? defaultSettings.default_iva,
            default_validity_days: user.default_validity_days ?? defaultSettings.default_validity_days,
            default_payment_conditions: user.default_payment_conditions || defaultSettings.default_payment_conditions,
          });
        }
      }
    } catch {
      setApiAvailable(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ─── Quotes ───────────────────────────────────────────────────────────

  const addQuote = async (quote: Quote) => {
    setQuotes((prev) => [quote, ...prev]);
    if (apiAvailable) {
      try {
        const res = await apiRequest('POST', '/api/quotes', quote);
        const created = await res.json();
        setQuotes((prev) => prev.map((q) => (q.id === quote.id ? mapApiQuote(created) : q)));
      } catch { /* keep local */ }
    }
  };

  const updateQuote = async (id: string, updates: Partial<Quote>) => {
    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates, updated_at: new Date().toISOString() } : q))
    );
    if (apiAvailable) {
      try { await apiRequest('PATCH', `/api/quotes/${id}`, updates); } catch { /* keep local */ }
    }
  };

  const deleteQuote = async (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
    if (apiAvailable) {
      try { await apiRequest('DELETE', `/api/quotes/${id}`); } catch { /* keep local */ }
    }
  };

  // ─── Materials ────────────────────────────────────────────────────────

  const addMaterial = async (material: Material) => {
    setMaterials((prev) => [...prev, material]);
    if (apiAvailable) {
      try {
        const res = await apiRequest('POST', '/api/materials', material);
        const created = await res.json();
        setMaterials((prev) => prev.map((m) => (m.id === material.id ? created : m)));
      } catch { /* keep local */ }
    }
  };

  const updateMaterial = async (id: string, updates: Partial<Material>) => {
    setMaterials((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
    if (apiAvailable) {
      try { await apiRequest('PATCH', `/api/materials/${id}`, updates); } catch { /* keep local */ }
    }
  };

  const deleteMaterial = async (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
    if (apiAvailable) {
      try { await apiRequest('DELETE', `/api/materials/${id}`); } catch { /* keep local */ }
    }
  };

  // ─── Labor ────────────────────────────────────────────────────────────

  const addLabor = async (labor: Labor) => {
    setLabor((prev) => [...prev, labor]);
    if (apiAvailable) {
      try {
        const res = await apiRequest('POST', '/api/labor', labor);
        const created = await res.json();
        setLabor((prev) => prev.map((l) => (l.id === labor.id ? created : l)));
      } catch { /* keep local */ }
    }
  };

  const updateLabor = async (id: string, updates: Partial<Labor>) => {
    setLabor((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
    if (apiAvailable) {
      try { await apiRequest('PATCH', `/api/labor/${id}`, updates); } catch { /* keep local */ }
    }
  };

  const deleteLabor = async (id: string) => {
    setLabor((prev) => prev.filter((l) => l.id !== id));
    if (apiAvailable) {
      try { await apiRequest('DELETE', `/api/labor/${id}`); } catch { /* keep local */ }
    }
  };

  // ─── Templates ────────────────────────────────────────────────────────

  const addTemplate = async (template: Template) => {
    setTemplates((prev) => [...prev, template]);
    if (apiAvailable) {
      try {
        const res = await apiRequest('POST', '/api/templates', template);
        const created = await res.json();
        setTemplates((prev) => prev.map((t) => (t.id === template.id ? created : t)));
      } catch { /* keep local */ }
    }
  };

  const deleteTemplate = async (id: string) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
    if (apiAvailable) {
      try { await apiRequest('DELETE', `/api/templates/${id}`); } catch { /* keep local */ }
    }
  };

  // ─── Settings ─────────────────────────────────────────────────────────

  const updateSettings = async (updates: Partial<CompanySettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    if (apiAvailable) {
      try { await apiRequest('PATCH', '/api/settings', updates); } catch { /* keep local */ }
    }
  };

  return (
    <AppContext.Provider
      value={{
        materials,
        labor,
        templates,
        quotes,
        settings,
        loading,
        addQuote,
        updateQuote,
        deleteQuote,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addLabor,
        updateLabor,
        deleteLabor,
        addTemplate,
        deleteTemplate,
        updateSettings,
        refreshData,
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
