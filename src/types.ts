export interface Project {
  _id: string;
  name: string;
  quantityRequired?: number;
  quantityProduced?: number;
  topImage?: string;
  bottomImage?: string;
  width: number;
  height: number;
  // ...other project fields...
}

export interface BoardComponent {
  _id: string;
  mfrPartNo: string;
  mfrName?: string;
  qtyPerPCB: number;
  qtyInHand: number;
  projectId: Project;
  // ...other component fields...
}

export interface MechanicalComponent {
  _id: string;
  name: string;
  description?: string;
  qtyPerPCB: number;
  qtyInHand: number;
  projectId: Project;
}

export interface Product {
  _id: string;
  serialNumber: string;
  status: string;
  projectId: Project;
}

export interface Designator {
  _id: string;
  name: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  isTop: boolean;
  isBottom: boolean;
  componentId: string;

  // ...other designator fields...
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  message?: string;
}

export interface QRCodeParams {
  pm: string; // manufacturer part number
  qty: string; // quantity
  [key: string]: string;
}

export interface UpdateComponentRequest {
  _id: string;
  mfrPartNo: string;
  mfrName?: string;
  qtyPerPCB: number;
  qtyInHand: number;
}

export interface UpdateMechanicalComponentRequest {
  _id: string;
  name: string;
  description?: string;
  qtyPerPCB: number;
  qtyInHand: number;
}

export interface UpdateProductRequest {
  ids: string[];
  status: string;
}
