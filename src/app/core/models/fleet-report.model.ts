
export interface FleetReport {
  reportID: string;
  metrics: { costAnalysis: number; safetyPerformance: number; downtimeHours: number };
  generatedDate: string; // ISO date
}
