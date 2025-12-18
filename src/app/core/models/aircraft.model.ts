
export type AircraftCategory = 'Commercial' | 'Defense' | 'Cargo';
export type ComplianceStatus = 'Compliant' | 'Non-Compliant' | 'Pending';

export interface ServiceEvent {
  id: string;
  date: string; // ISO date string
  description: string;
  performedBy: string;
}

export interface Aircraft {
  aircraftID: string;
  model: string;
  category: AircraftCategory;
  complianceStatus: ComplianceStatus;
  serviceHistory: ServiceEvent[];
}
