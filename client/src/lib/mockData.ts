import { Material, Labor, Template, Quote } from './types';

export const MOCK_MATERIALS: Material[] = [
  { id: '1', name: 'Carrelage Gris 60x60', category: 'Carrelage/Cerâmica', unit: 'm²', cost_price: 25, sell_price: 35 },
  { id: '2', name: 'Colle Flex C2TE', category: 'Colles et Mortiers/Cimentos', unit: 'kg', cost_price: 15, sell_price: 22 },
  { id: '3', name: 'Peinture Blanche Mate', category: 'Peinture/Tintas', unit: 'L', cost_price: 40, sell_price: 65 },
  { id: '4', name: 'Tuyau PVC 40mm', category: 'Plomberie/Canalização', unit: 'ml', cost_price: 3, sell_price: 5 },
  { id: '5', name: 'Câble électrique 3G2.5', category: 'Électricité/Eletricidade', unit: 'ml', cost_price: 1.5, sell_price: 2.5 },
];

export const MOCK_LABOR: Labor[] = [
  { id: '1', name: 'Maçon/Pedreiro', trade: 'Masonry', unit: 'h', price_lux: 45, price_pt: 15 },
  { id: '2', name: 'Carreleur/Ladrilhador', trade: 'Tiling', unit: 'm²', price_lux: 65, price_pt: 25 },
  { id: '3', name: 'Peintre/Pintor', trade: 'Painting', unit: 'm²', price_lux: 35, price_pt: 12 },
  { id: '4', name: 'Plombier/Canalizador', trade: 'Plumbing', unit: 'h', price_lux: 55, price_pt: 20 },
  { id: '5', name: 'Électricien/Eletricista', trade: 'Electrical', unit: 'h', price_lux: 55, price_pt: 20 },
];

export const SYSTEM_TEMPLATES: Template[] = [
  {
    id: 't1',
    name: 'Salle de Bain Complète / Casa de Banho Completa',
    is_system_template: true,
    sections: [
      {
        id: 's1',
        name: 'Démolition/Demolição',
        items: [
          { id: 'i1', description: 'Démolition revêtements', unit: 'm²', quantity: 1, unit_price: 25, total: 25, item_type: 'labor' },
          { id: 'i2', description: 'Enlèvement sanitaires', unit: 'un', quantity: 1, unit_price: 50, total: 50, item_type: 'labor' },
        ],
        subtotal: 75
      },
      {
        id: 's2',
        name: 'Carrelage/Cerâmica',
        items: [
          { id: 'i3', description: 'Carrelage sol fourni posé', unit: 'm²', quantity: 1, unit_price: 95, total: 95, item_type: 'material' },
        ],
        subtotal: 95
      }
    ]
  },
  {
    id: 't2',
    name: 'Peinture Appartement / Pintura Apartamento',
    is_system_template: true,
    sections: [
      {
        id: 's3',
        name: 'Préparation/Preparação',
        items: [
          { id: 'i4', description: 'Réparation fissures', unit: 'vg', quantity: 1, unit_price: 150, total: 150, item_type: 'labor' },
        ],
        subtotal: 150
      }
    ]
  }
];

export const MOCK_QUOTES: Quote[] = [
  {
    id: 'q1',
    quote_number: 'Q-2026-001',
    client_name: 'Jean Dupont',
    client_address: '123 Rue de Luxembourg',
    status: 'sent',
    validity_days: 30,
    discount_percentage: 0,
    iva_rate: 17,
    created_at: '2026-02-10',
    sections: [],
    total_materials: 0,
    total_labor: 0,
    subtotal: 1500,
    discount_amount: 0,
    iva_amount: 255,
    total: 1755
  },
  {
    id: 'q2',
    quote_number: 'Q-2026-002',
    client_name: 'Maria Silva',
    client_address: 'Av. da Liberdade, Lisboa',
    status: 'draft',
    validity_days: 30,
    discount_percentage: 0,
    iva_rate: 23,
    created_at: '2026-02-12',
    sections: [],
    total_materials: 0,
    total_labor: 0,
    subtotal: 3500,
    discount_amount: 0,
    iva_amount: 805,
    total: 4305
  }
];
