
export type Language = 'pt' | 'fr';

export type Company = {
  id: string;
  name: string;
  address: string;
  nif: string;
  email: string;
  phone: string;
  default_iva: number;
  currency: string;
  logo_url?: string;
};

export type MaterialCategory = 
  | 'Carrelage/Cerâmica'
  | 'Peinture/Tintas'
  | 'Colles et Mortiers/Cimentos'
  | 'Étanchéité/Impermeabilização'
  | 'Sols/Pavimentos'
  | 'Plomberie/Canalização'
  | 'Électricité/Eletricidade'
  | 'Quincaillerie/Ferragens'
  | 'Isolation/Isolamento'
  | 'Bois/Madeiras'
  | 'Autre/Outros';

export type Material = {
  id: string;
  name: string;
  category: MaterialCategory;
  unit: string;
  cost_price: number;
  sell_price: number;
  supplier?: string;
  reference?: string;
};

export type Labor = {
  id: string;
  name: string;
  trade: string;
  unit: string;
  price_lux: number;
  price_pt: number;
};

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export type QuoteItemType = 'material' | 'labor' | 'manual';

export type QuoteItem = {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  unit_price: number;
  total: number;
  item_type: QuoteItemType;
};

export type QuoteSection = {
  id: string;
  name: string;
  items: QuoteItem[];
  subtotal: number;
};

export type Quote = {
  id: string;
  quote_number: string;
  client_name: string;
  client_email?: string;
  client_phone?: string;
  client_address: string;
  status: QuoteStatus;
  notes?: string;
  payment_conditions?: string;
  validity_days: number;
  execution_timeframe?: string;
  discount_percentage: number;
  iva_rate: number;
  created_at: string;
  sections: QuoteSection[];
  total_materials: number;
  total_labor: number;
  subtotal: number;
  discount_amount: number;
  iva_amount: number;
  total: number;
};

export type Template = {
  id: string;
  name: string;
  is_system_template: boolean;
  sections: QuoteSection[]; // Simplified for prototype
};
