export type ScreenType =
  | 'catalog'
  | 'product-detail'
  | 'compare'
  | 'cart'
  | 'order-preview'
  | 'order-success'
  | 'admin-orders'
  | 'admin-catalog'
  | 'documents'
  | 'account'
  | 'sld-viewer'
  | 'sld-markup'
  | 'auth';

export interface EavSpec {
  key: string;
  label: string;
  value: string;
  unit?: string;
  isHighlight?: boolean;
}

export interface EquipmentProduct {
  id: string;
  name: string;
  brand: string;
  brandOrigin: string;
  model: string;
  sku: string;
  category: 'mcb' | 'mccb' | 'contactor' | 'relay' | 'plc' | 'power-supply';
  categoryLabel: string;
  image: string;
  ratingAmps: number;
  voltage: string;
  breakingCapacityKa: number;
  poles: string;
  tripCurve?: string;
  powerKw?: number;
  coilVoltage?: string;
  auxContacts?: string;
  unitPrice: number;
  priceNote?: string;
  inStock: boolean;
  stockLocation: string;
  weightKg: number;
  complianceStd: string;
  isFeatured?: boolean;
  hasCad?: boolean;
  hasManual?: boolean;
  eavSpecs: EavSpec[];
  description: string;
  subCategory?: string;
  dinMount?: string;
}

export interface CartItem {
  product: EquipmentProduct;
  quantity: number;
  assemblyNote?: string;
}

export interface OrderItemLine {
  product: EquipmentProduct;
  quantity: number;
  unitPrice: number;
  priceType: 'fixed' | 'rfq';
  statusLabel: string;
  statusColor?: 'emerald' | 'amber' | 'primary';
}

export interface IndustrialOrder {
  id: string;
  orderNumber: string;
  date: string;
  time: string;
  clientName: string;
  company: string;
  phone: string;
  engCode: string;
  address: string;
  engineerNote: string;
  items: OrderItemLine[];
  subtotal: number;
  fixedSubtotal: number;
  pendingRfqCount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  statusLabel: string;
  currentStep: number; // 1 to 5
  dispatchSlaNote: string;
  tagGroup: string;
  history?: OrderTimelineEvent[];
  twoFactorVerified?: boolean;
  twoFactorApprover?: string;
  twoFactorMethod?: 'code' | 'email';
  twoFactorTimestamp?: string;
  twoFactorToken?: string;
}

export interface OrderTimelineEvent {
  id: string;
  stepNumber: number; // 1 to 5
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  title: string;
  description: string;
  timestamp: string;
  date: string;
  time: string;
  department: string;
  operatorName: string;
  operatorRole: string;
  isCompleted: boolean;
  isCurrent: boolean;
  icon: string;
  technicalChecks?: string[];
  trackingCode?: string;
  engineerNote?: string;
}

export interface TechnicalDocument {
  id: string;
  title: string;
  subtitle: string;
  type: 'pdf' | 'dwg' | 'wiring' | 'certificate' | 'manual';
  typeLabel: string;
  size: string;
  ratingCode: string;
  partNumber: string;
  isDownloaded: boolean;
  standard: string;
  complianceNotes: string;
}

export interface DrawingMarkup {
  id: number;
  tag: string;
  title: string;
  description: string;
  priority: 'critical' | 'warning' | 'info';
  status: 'open' | 'resolved';
  author: string;
  time: string;
  date: string;
  assignedTo: string;
  color: 'red' | 'amber' | 'emerald';
}
