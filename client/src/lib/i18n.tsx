import React, { createContext, useContext, useState } from 'react';

type Language = 'pt' | 'fr';

type Translations = {
  [key: string]: {
    pt: string;
    fr: string;
  };
};

const translations: Translations = {
  dashboard: { pt: 'Painel', fr: 'Tableau de bord' },
  quotes: { pt: 'Orçamentos', fr: 'Devis' },
  materials: { pt: 'Materiais', fr: 'Matériaux' },
  labor: { pt: 'Mão de Obra', fr: 'Main d\'œuvre' },
  templates: { pt: 'Modelos', fr: 'Modèles' },
  settings: { pt: 'Definições', fr: 'Paramètres' },
  newQuote: { pt: 'Novo Orçamento', fr: 'Nouveau Devis' },
  addMaterial: { pt: 'Adicionar Material', fr: 'Ajouter Matériau' },
  addLabor: { pt: 'Adicionar Mão de Obra', fr: 'Ajouter Main d\'œuvre' },
  search: { pt: 'Pesquisar...', fr: 'Rechercher...' },
  client: { pt: 'Cliente', fr: 'Client' },
  address: { pt: 'Morada', fr: 'Adresse' },
  status: { pt: 'Estado', fr: 'Statut' },
  total: { pt: 'Total', fr: 'Total' },
  date: { pt: 'Data', fr: 'Date' },
  draft: { pt: 'Rascunho', fr: 'Brouillon' },
  sent: { pt: 'Enviado', fr: 'Envoyé' },
  accepted: { pt: 'Aceite', fr: 'Accepté' },
  rejected: { pt: 'Rejeitado', fr: 'Rejeté' },
  actions: { pt: 'Ações', fr: 'Actions' },
  edit: { pt: 'Editar', fr: 'Modifier' },
  delete: { pt: 'Eliminar', fr: 'Supprimer' },
  save: { pt: 'Guardar', fr: 'Sauvegarder' },
  cancel: { pt: 'Cancelar', fr: 'Annuler' },
  logout: { pt: 'Sair', fr: 'Déconnexion' },
  overview: { pt: 'Visão Geral', fr: 'Vue d\'ensemble' },
  activeValue: { pt: 'Valor Ativo', fr: 'Valeur Active' },
  conversionRate: { pt: 'Taxa de Conversão', fr: 'Taux de Conversion' },
  avgQuoteValue: { pt: 'Valor Médio', fr: 'Valeur Moyenne' },
  recentQuotes: { pt: 'Orçamentos Recentes', fr: 'Devis Récents' },
  quickActions: { pt: 'Ações Rápidas', fr: 'Actions Rapides' },
  name: { pt: 'Nome', fr: 'Nom' },
  category: { pt: 'Categoria', fr: 'Catégorie' },
  unit: { pt: 'Unidade', fr: 'Unité' },
  cost: { pt: 'Custo', fr: 'Coût' },
  price: { pt: 'Preço', fr: 'Prix' },
  supplier: { pt: 'Fornecedor', fr: 'Fournisseur' },
  trade: { pt: 'Ofício', fr: 'Métier' },
  priceLux: { pt: 'Preço LUX', fr: 'Prix LUX' },
  pricePt: { pt: 'Preço PT', fr: 'Prix PT' },
  description: { pt: 'Descrição', fr: 'Description' },
  quantity: { pt: 'Quantidade', fr: 'Quantité' },
  unitPrice: { pt: 'Preço Unit.', fr: 'Prix Unit.' },
  subtotal: { pt: 'Subtotal', fr: 'Sous-total' },
  discount: { pt: 'Desconto', fr: 'Remise' },
  iva: { pt: 'IVA', fr: 'TVA' },
  notes: { pt: 'Notas', fr: 'Notes' },
  paymentConditions: { pt: 'Condições de Pagamento', fr: 'Conditions de Paiement' },
  executionTimeframe: { pt: 'Prazo de Execução', fr: 'Délai d\'Exécution' },
  validity: { pt: 'Validade', fr: 'Validité' },
  days: { pt: 'dias', fr: 'jours' },
  generateAI: { pt: 'Gerar com AI', fr: 'Générer avec AI' },
  applyTemplate: { pt: 'Aplicar Modelo', fr: 'Appliquer Modèle' },
  exportPDF: { pt: 'Exportar PDF', fr: 'Exporter PDF' },
  duplicate: { pt: 'Duplicar', fr: 'Dupliquer' },
  addSection: { pt: 'Adicionar Secção', fr: 'Ajouter Section' },
  addItem: { pt: 'Adicionar Item', fr: 'Ajouter Item' },
  manualItem: { pt: 'Item Manual', fr: 'Item Manuel' },
  fromCatalog: { pt: 'Do Catálogo', fr: 'Du Catalogue' },
  suggest: { pt: 'Sugerir', fr: 'Suggérer' },
  back: { pt: 'Voltar', fr: 'Retour' },
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string) => {
    if (!translations[key]) return key;
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
