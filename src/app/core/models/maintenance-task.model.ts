
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export interface MaintenanceTask { taskID: string; aircraftID: string; scheduledDate: string; status: TaskStatus; }
