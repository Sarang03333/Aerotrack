import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {
  MaintenanceTask,
  TaskStatus,
} from "../../core/models/maintenance-task.model";
import { HttpClient } from "@angular/common/http";

const STORAGE_KEY = "aerotrack.maintenance";

@Injectable({ providedIn: "root" })
export class MaintenanceService {
  private readonly _tasks$ = new BehaviorSubject<MaintenanceTask[]>([]);
  constructor(private http: HttpClient) {
    this.initialize();
  }

  private initialize() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        this._tasks$.next(JSON.parse(cached));
        return;
      } catch {}
    }

    this.http.get<MaintenanceTask[]>("assets/mock/maintenance.json").subscribe({
      next: (data) => {
        this._tasks$.next(data); //put fetched data into BehaviorSubject (shared state)
        this.persist(); //save current task to local storage
      },
      error: () => {
        this._tasks$.next([
          {
            taskID: "MT-9001",
            aircraftID: "AT-9001",
            scheduledDate: new Date().toISOString().slice(0, 10),
            status: "PENDING",
          },
        ]);
        this.persist();
      },
    });
  }

  list(): Observable<MaintenanceTask[]> {
    return this._tasks$.asObservable();
  }

  getValue(): MaintenanceTask[] {
    return this._tasks$.getValue();
  }

  getById(id: string) {
    return this.getValue().find((t) => t.taskID === id);
  }

  add(task: MaintenanceTask): void {
    const arr = this.getValue();
    if (arr.some((t) => t.taskID === task.taskID))
      throw new Error("TaskID must be unique");
    this._tasks$.next([...arr, task]); //create new array with old tasks plus new ones
    this.persist();
  }

  update(id: string, changes: Partial<MaintenanceTask>): void {
    this._tasks$.next(
      this.getValue().map((t) => (t.taskID === id ? { ...t, ...changes } : t))
    );
    this.persist();
  }

  remove(id: string): void {
    this._tasks$.next(this.getValue().filter((t) => t.taskID !== id));
    this.persist();
  }

  setStatus(id: string, status: TaskStatus): void {
    this.update(id, { status });
  }

  filter(term: string, status?: TaskStatus): MaintenanceTask[] {
    const t = (term || "").toLowerCase();
    return this.getValue().filter((x) => {
      const m1 =
        !t ||
        x.taskID.toLowerCase().includes(t) ||
        x.aircraftID.toLowerCase().includes(t);
      const m2 = !status || x.status === status;
      return m1 && m2;
    });
  }

  createEmergency(aircraftID: string): MaintenanceTask {
    const id = `MT-${Math.floor(1000 + Math.random() * 9000)}`;
    return {
      taskID: id,
      aircraftID,
      scheduledDate: new Date().toISOString().slice(0, 10),
      status: "PENDING",
    };
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.getValue()));
  }
}
