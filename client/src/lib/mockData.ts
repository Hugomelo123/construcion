import { Material, Labor, Template, Quote } from './types';

export const MOCK_MATERIALS: Material[] = [
  { id: '1', name: 'Carrelage Gris 60x60', category: 'Carrelage/Cerâmica', unit: 'm²', cost_price: 25, sell_price: 35 },
  { id: '2', name: 'Colle Flex C2TE 25kg', category: 'Colles et Mortiers/Cimentos', unit: 'kg', cost_price: 15, sell_price: 22 },
  { id: '3', name: 'Peinture Blanche Mate 10L', category: 'Peinture/Tintas', unit: 'L', cost_price: 40, sell_price: 65 },
  { id: '4', name: 'Tuyau PVC 40mm', category: 'Plomberie/Canalização', unit: 'ml', cost_price: 3, sell_price: 5 },
  { id: '5', name: 'Câble électrique 3G2.5', category: 'Électricité/Eletricidade', unit: 'ml', cost_price: 1.5, sell_price: 2.5 },
  { id: '6', name: 'Primaire accrochage', category: 'Étanchéité/Impermeabilização', unit: 'm²', cost_price: 3, sell_price: 6 },
  { id: '7', name: 'Membrane étanchéité', category: 'Étanchéité/Impermeabilização', unit: 'm²', cost_price: 10, sell_price: 18 },
  { id: '8', name: 'Joint carrelage 5kg', category: 'Colles et Mortiers/Cimentos', unit: 'kg', cost_price: 5, sell_price: 8 },
  { id: '9', name: 'Sol stratifié chêne', category: 'Sols/Pavimentos', unit: 'm²', cost_price: 20, sell_price: 35 },
  { id: '10', name: 'Sous-couche acoustique', category: 'Sols/Pavimentos', unit: 'm²', cost_price: 3, sell_price: 6 },
  { id: '11', name: 'Plinthe bois MDF', category: 'Bois/Madeiras', unit: 'ml', cost_price: 5, sell_price: 9 },
  { id: '12', name: 'Bande étanchéité', category: 'Étanchéité/Impermeabilização', unit: 'ml', cost_price: 4, sell_price: 8 },
];

export const MOCK_LABOR: Labor[] = [
  { id: '1', name: 'Maçon / Pedreiro', trade: 'Maçonnerie / Alvenaria', unit: 'h', price_lux: 45, price_pt: 15 },
  { id: '2', name: 'Carreleur / Ladrilhador', trade: 'Carrelage / Ladrilhos', unit: 'm²', price_lux: 65, price_pt: 25 },
  { id: '3', name: 'Peintre / Pintor', trade: 'Peinture / Pintura', unit: 'm²', price_lux: 35, price_pt: 12 },
  { id: '4', name: 'Plombier / Canalizador', trade: 'Plomberie / Canalização', unit: 'h', price_lux: 55, price_pt: 20 },
  { id: '5', name: 'Électricien / Eletricista', trade: 'Électricité / Eletricidade', unit: 'h', price_lux: 55, price_pt: 20 },
  { id: '6', name: 'Plâtrier / Estucador', trade: 'Plâtrerie / Estuque', unit: 'm²', price_lux: 50, price_pt: 18 },
  { id: '7', name: 'Menuisier / Carpinteiro', trade: 'Menuiserie / Carpintaria', unit: 'h', price_lux: 50, price_pt: 18 },
  { id: '8', name: 'Serrurier / Serralheiro', trade: 'Serrurerie / Serralharia', unit: 'h', price_lux: 55, price_pt: 20 },
  { id: '9', name: 'Démolition / Demolição', trade: 'Démolition / Demolição', unit: 'h', price_lux: 50, price_pt: 20 },
  { id: '10', name: 'Manœuvre / Servente', trade: 'Général / Geral', unit: 'h', price_lux: 30, price_pt: 10 },
];

export const SYSTEM_TEMPLATES: Template[] = [
  {
    id: 't1', name: 'Salle de Bain / Casa de Banho', is_system_template: true,
    sections: [
      { id: 's1', name: 'Démolition', subtotal: 755, items: [
        { id: 'i1', description: 'Démolition revêtements', unit: 'm²', quantity: 15, unit_price: 25, total: 375, item_type: 'labor' },
        { id: 'i2', description: 'Enlèvement sanitaires', unit: 'un', quantity: 4, unit_price: 50, total: 200, item_type: 'labor' },
        { id: 'i3', description: 'Transport déchets', unit: 'vg', quantity: 1, unit_price: 180, total: 180, item_type: 'labor' },
      ]},
      { id: 's2', name: 'Étanchéité', subtotal: 456, items: [
        { id: 'i4', description: 'Primaire accrochage', unit: 'm²', quantity: 15, unit_price: 6, total: 90, item_type: 'material' },
        { id: 'i5', description: 'Membrane étanchéité', unit: 'm²', quantity: 15, unit_price: 18, total: 270, item_type: 'material' },
        { id: 'i6', description: 'Bande étanchéité', unit: 'ml', quantity: 12, unit_price: 8, total: 96, item_type: 'material' },
      ]},
      { id: 's3', name: 'Carrelage', subtotal: 2923.5, items: [
        { id: 'i7', description: 'Carrelage sol fourni posé', unit: 'm²', quantity: 8, unit_price: 95, total: 760, item_type: 'material' },
        { id: 'i8', description: 'Carrelage murs fourni posé', unit: 'm²', quantity: 20, unit_price: 90, total: 1800, item_type: 'material' },
        { id: 'i9', description: 'Colle carrelage', unit: 'kg', quantity: 75, unit_price: 2.50, total: 187.50, item_type: 'material' },
        { id: 'i10', description: 'Joint carrelage', unit: 'kg', quantity: 10, unit_price: 8, total: 80, item_type: 'material' },
        { id: 'i11', description: 'Profilés finition', unit: 'ml', quantity: 8, unit_price: 12, total: 96, item_type: 'material' },
      ]},
      { id: 's4', name: 'Sanitaires', subtotal: 2310, items: [
        { id: 'i12', description: 'WC suspendu', unit: 'un', quantity: 1, unit_price: 500, total: 500, item_type: 'material' },
        { id: 'i13', description: 'Meuble vasque', unit: 'un', quantity: 1, unit_price: 700, total: 700, item_type: 'material' },
        { id: 'i14', description: 'Receveur douche', unit: 'un', quantity: 1, unit_price: 450, total: 450, item_type: 'material' },
        { id: 'i15', description: 'Robinetterie douche', unit: 'un', quantity: 1, unit_price: 280, total: 280, item_type: 'material' },
        { id: 'i16', description: 'Robinetterie lavabo', unit: 'un', quantity: 1, unit_price: 180, total: 180, item_type: 'material' },
        { id: 'i17', description: 'Accessoires', unit: 'vg', quantity: 1, unit_price: 200, total: 200, item_type: 'material' },
      ]},
      { id: 's5', name: 'Plomberie', subtotal: 1250, items: [
        { id: 'i18', description: 'Plombier installation', unit: 'vg', quantity: 1, unit_price: 900, total: 900, item_type: 'labor' },
        { id: 'i19', description: 'Matériel plomberie', unit: 'vg', quantity: 1, unit_price: 350, total: 350, item_type: 'material' },
      ]},
      { id: 's6', name: 'Électricité', subtotal: 630, items: [
        { id: 'i20', description: 'Électricien', unit: 'vg', quantity: 1, unit_price: 450, total: 450, item_type: 'labor' },
        { id: 'i21', description: 'Matériel électrique', unit: 'vg', quantity: 1, unit_price: 180, total: 180, item_type: 'material' },
      ]},
    ]
  },
  {
    id: 't2', name: 'Peinture Appartement / Pintura Apartamento', is_system_template: true,
    sections: [
      { id: 's7', name: 'Préparation', subtotal: 1110, items: [
        { id: 'i22', description: 'Réparation fissures', unit: 'vg', quantity: 1, unit_price: 150, total: 150, item_type: 'labor' },
        { id: 'i23', description: 'Ponçage murs', unit: 'm²', quantity: 80, unit_price: 6, total: 480, item_type: 'labor' },
        { id: 'i24', description: 'Primaire accrochage', unit: 'm²', quantity: 80, unit_price: 5, total: 400, item_type: 'material' },
        { id: 'i25', description: 'Protection sols/meubles', unit: 'vg', quantity: 1, unit_price: 80, total: 80, item_type: 'material' },
      ]},
      { id: 's8', name: 'Peinture', subtotal: 1730, items: [
        { id: 'i26', description: 'Peinture mate murs', unit: 'm²', quantity: 80, unit_price: 12, total: 960, item_type: 'material' },
        { id: 'i27', description: 'Peinture plafonds', unit: 'm²', quantity: 45, unit_price: 11, total: 495, item_type: 'material' },
        { id: 'i28', description: 'Laque portes', unit: 'un', quantity: 5, unit_price: 55, total: 275, item_type: 'material' },
      ]},
      { id: 's9', name: "Main d'œuvre", subtotal: 3825, items: [
        { id: 'i29', description: 'Peintre murs et plafonds', unit: 'm²', quantity: 125, unit_price: 28, total: 3500, item_type: 'labor' },
        { id: 'i30', description: 'Peintre portes', unit: 'un', quantity: 5, unit_price: 65, total: 325, item_type: 'labor' },
      ]},
    ]
  },
  {
    id: 't3', name: 'Rénovation Cuisine / Renovação Cozinha', is_system_template: true,
    sections: [
      { id: 's10', name: 'Démolition', subtotal: 1080, items: [
        { id: 'i31', description: 'Enlèvement cuisine existante', unit: 'vg', quantity: 1, unit_price: 400, total: 400, item_type: 'labor' },
        { id: 'i32', description: 'Démolition revêtements', unit: 'm²', quantity: 20, unit_price: 25, total: 500, item_type: 'labor' },
        { id: 'i33', description: 'Transport déchets', unit: 'vg', quantity: 1, unit_price: 180, total: 180, item_type: 'labor' },
      ]},
      { id: 's11', name: 'Plomberie et Électricité', subtotal: 2000, items: [
        { id: 'i34', description: 'Plombier', unit: 'vg', quantity: 1, unit_price: 800, total: 800, item_type: 'labor' },
        { id: 'i35', description: 'Électricien', unit: 'vg', quantity: 1, unit_price: 700, total: 700, item_type: 'labor' },
        { id: 'i36', description: 'Matériel plomberie', unit: 'vg', quantity: 1, unit_price: 280, total: 280, item_type: 'material' },
        { id: 'i37', description: 'Matériel électrique', unit: 'vg', quantity: 1, unit_price: 220, total: 220, item_type: 'material' },
      ]},
      { id: 's12', name: 'Revêtements', subtotal: 1660, items: [
        { id: 'i38', description: 'Carrelage sol', unit: 'm²', quantity: 12, unit_price: 95, total: 1140, item_type: 'material' },
        { id: 'i39', description: 'Crédence murale', unit: 'm²', quantity: 4, unit_price: 110, total: 440, item_type: 'material' },
        { id: 'i40', description: 'Colle et joint', unit: 'vg', quantity: 1, unit_price: 80, total: 80, item_type: 'material' },
      ]},
      { id: 's13', name: 'Peinture', subtotal: 1225, items: [
        { id: 'i41', description: 'Peinture murs et plafond', unit: 'm²', quantity: 35, unit_price: 35, total: 1225, item_type: 'material' },
      ]},
      { id: 's14', name: "Main d'œuvre", subtotal: 1610, items: [
        { id: 'i42', description: 'Carreleur', unit: 'm²', quantity: 16, unit_price: 60, total: 960, item_type: 'labor' },
        { id: 'i43', description: 'Montage meubles cuisine', unit: 'vg', quantity: 1, unit_price: 650, total: 650, item_type: 'labor' },
      ]},
    ]
  },
  {
    id: 't4', name: 'Sol Stratifié / Pavimento Flutuante', is_system_template: true,
    sections: [
      { id: 's15', name: 'Préparation', subtotal: 1260, items: [
        { id: 'i44', description: 'Enlèvement ancien sol', unit: 'm²', quantity: 40, unit_price: 12, total: 480, item_type: 'labor' },
        { id: 'i45', description: 'Ragréage', unit: 'm²', quantity: 40, unit_price: 18, total: 720, item_type: 'material' },
        { id: 'i46', description: 'Nettoyage chantier', unit: 'vg', quantity: 1, unit_price: 60, total: 60, item_type: 'labor' },
      ]},
      { id: 's16', name: 'Matériaux', subtotal: 2010, items: [
        { id: 'i47', description: 'Sol stratifié chêne', unit: 'm²', quantity: 40, unit_price: 35, total: 1400, item_type: 'material' },
        { id: 'i48', description: 'Sous-couche acoustique', unit: 'm²', quantity: 40, unit_price: 6, total: 240, item_type: 'material' },
        { id: 'i49', description: 'Plinthes', unit: 'ml', quantity: 30, unit_price: 9, total: 270, item_type: 'material' },
        { id: 'i50', description: 'Barres de seuil', unit: 'un', quantity: 4, unit_price: 25, total: 100, item_type: 'material' },
      ]},
      { id: 's17', name: "Main d'œuvre", subtotal: 972, items: [
        { id: 'i51', description: 'Pose sol stratifié', unit: 'm²', quantity: 40, unit_price: 18, total: 720, item_type: 'labor' },
        { id: 'i52', description: 'Pose plinthes', unit: 'ml', quantity: 30, unit_price: 6, total: 180, item_type: 'labor' },
        { id: 'i53', description: 'Pose barres de seuil', unit: 'un', quantity: 4, unit_price: 18, total: 72, item_type: 'labor' },
      ]},
    ]
  },
  {
    id: 't5', name: 'Étanchéité Terrasse / Impermeabilização Terraço', is_system_template: true,
    sections: [
      { id: 's18', name: 'Préparation', subtotal: 700, items: [
        { id: 'i54', description: 'Enlèvement ancien revêtement', unit: 'm²', quantity: 25, unit_price: 16, total: 400, item_type: 'labor' },
        { id: 'i55', description: 'Nettoyage haute pression', unit: 'm²', quantity: 25, unit_price: 6, total: 150, item_type: 'labor' },
        { id: 'i56', description: 'Réparation fissures', unit: 'ml', quantity: 15, unit_price: 10, total: 150, item_type: 'material' },
      ]},
      { id: 's19', name: 'Étanchéité', subtotal: 1435, items: [
        { id: 'i57', description: 'Primaire accrochage', unit: 'm²', quantity: 25, unit_price: 7, total: 175, item_type: 'material' },
        { id: 'i58', description: 'Membrane 2 couches', unit: 'm²', quantity: 25, unit_price: 32, total: 800, item_type: 'material' },
        { id: 'i59', description: 'Renforts points singuliers', unit: 'vg', quantity: 1, unit_price: 160, total: 160, item_type: 'material' },
        { id: 'i60', description: 'Protection mécanique', unit: 'm²', quantity: 25, unit_price: 12, total: 300, item_type: 'material' },
      ]},
      { id: 's20', name: "Main d'œuvre", subtotal: 625, items: [
        { id: 'i61', description: 'Applicateur étanchéité', unit: 'm²', quantity: 25, unit_price: 25, total: 625, item_type: 'labor' },
      ]},
    ]
  }
];

export const MOCK_QUOTES: Quote[] = [
  {
    id: 'q1', quote_number: 'Q-2026-001', client_name: 'Jean Dupont',
    client_email: 'jean.dupont@email.lu', client_phone: '+352 691 234 567',
    client_address: '45 Rue de Hollerich, L-1741 Luxembourg',
    status: 'sent', validity_days: 30, discount_percentage: 0, iva_rate: 17,
    created_at: '2026-02-10',
    payment_conditions: '30% acompte, 30% démarrage, 30% avancement, 10% réception',
    execution_timeframe: '3-4 semaines',
    sections: SYSTEM_TEMPLATES[0].sections,
    total_materials: 5257.50, total_labor: 2555,
    subtotal: 7812.50, discount_amount: 0, iva_amount: 1328.13, total: 9140.63
  },
  {
    id: 'q2', quote_number: 'Q-2026-002', client_name: 'Maria Silva',
    client_email: 'maria.silva@email.pt', client_phone: '+352 621 345 678',
    client_address: '12 Avenue de la Liberté, L-1930 Luxembourg',
    status: 'draft', validity_days: 30, discount_percentage: 5, iva_rate: 17,
    created_at: '2026-02-12',
    sections: SYSTEM_TEMPLATES[1].sections,
    total_materials: 2210, total_labor: 3975,
    subtotal: 6185, discount_amount: 309.25, iva_amount: 998.88, total: 6874.63
  },
  {
    id: 'q3', quote_number: 'Q-2026-003', client_name: 'Pierre Martin',
    client_email: 'p.martin@email.lu', client_phone: '+352 661 456 789',
    client_address: '8 Rue de Strasbourg, L-2560 Luxembourg',
    status: 'accepted', validity_days: 30, discount_percentage: 0, iva_rate: 17,
    created_at: '2026-01-28',
    sections: SYSTEM_TEMPLATES[3].sections,
    total_materials: 2010, total_labor: 1512,
    subtotal: 3522, discount_amount: 0, iva_amount: 598.74, total: 4120.74
  },
];
