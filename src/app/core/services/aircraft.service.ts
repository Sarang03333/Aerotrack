
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Aircraft, ServiceEvent, ComplianceStatus, AircraftCategory } from '../../core/models/aircraft.model';
import { HttpClient } from '@angular/common/http';

const STORAGE_KEY = 'aerotrack.aircraft';

@Injectable({ providedIn: 'root' })
export class AircraftService {
  private readonly _aircraft$ = new BehaviorSubject<Aircraft[]>([]);
  constructor(private http: HttpClient) { this.initialize(); }

  private initialize() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) { try { this._aircraft$.next(JSON.parse(cached)); return; } catch {} }
    this.http.get<Aircraft[]>('assets/mock/aircraft.json').subscribe({
      next: (data) => { this._aircraft$.next(data); this.persist(); },
      error: () => { this._aircraft$.next([{ aircraftID:'AT-9001', model:'Mock Falcon', category:'Defense', complianceStatus:'Pending', serviceHistory:[] }]); this.persist(); }
    });
  }
  list(): Observable<Aircraft[]> { return this._aircraft$.asObservable(); }
  getValue(): Aircraft[] { return this._aircraft$.getValue(); }
  getById(id: string) { return this.getValue().find(a => a.aircraftID === id); }
  ids(): string[] { return this.getValue().map(a => a.aircraftID); }

  add(aircraft: Aircraft): void { const arr = this.getValue(); if (arr.some(a => a.aircraftID===aircraft.aircraftID)) throw new Error('AircraftID must be unique'); this._aircraft$.next([...arr, { ...aircraft, serviceHistory: aircraft.serviceHistory || [] }]); this.persist(); }
  update(id: string, changes: Partial<Aircraft>): void { this._aircraft$.next(this.getValue().map(a => a.aircraftID===id?{...a,...changes}:a)); this.persist(); }
  remove(id: string): void { this._aircraft$.next(this.getValue().filter(a => a.aircraftID!==id)); this.persist(); }
  addServiceEvent(id: string, event: ServiceEvent): void { this._aircraft$.next(this.getValue().map(a => a.aircraftID===id?{...a,serviceHistory:[...a.serviceHistory,event]}:a)); this.persist(); }
  filter(term: string, category?: AircraftCategory, compliance?: ComplianceStatus): Aircraft[] { const t=(term||'').toLowerCase(); return this.getValue().filter(a=>{ const m1=!t||a.aircraftID.toLowerCase().includes(t)||a.model.toLowerCase().includes(t); const m2=!category||a.category===category; const m3=!compliance||a.complianceStatus===compliance; return m1&&m2&&m3; }); }
  private persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(this.getValue())); }
}
