
export interface SparePart {
  partID: string;
  name: string;
  quantityAvailable: number;
  reorderLevel: number;
  lastUpdated: string; // ISO date
}
