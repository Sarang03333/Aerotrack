import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuditLog, Status } from '../../core/models/audit-log.model';
 
const STORAGE_KEY = 'aerotrack.audit';
 
/** Normalize any raw object into a properly typed AuditLog */
function normalizeLog(raw: Partial<AuditLog>): AuditLog {
  const statusStr = raw.status ?? 'PENDING';
  const status: Status = statusStr === 'RESOLVED' ? 'RESOLVED' : 'PENDING';
 
  return {
    auditID: String(raw.auditID ?? ''),
    aircraftID: String(raw.aircraftID ?? ''),
    findings: String(raw.findings ?? ''),
    status,
    date: String(raw.date ?? new Date().toISOString().slice(0, 10)),
    resolvedDate: raw.resolvedDate ? String(raw.resolvedDate) : undefined,
  };
}
 
@Injectable({ providedIn: 'root' })
export class AuditService {
  private readonly _logs$ = new BehaviorSubject<AuditLog[]>([]);
 
  constructor(private http: HttpClient) {
    this.initialize();
  }
 
  /** Load from localStorage; else mock JSON; else fallback */
  private initialize(): void {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Array<Partial<AuditLog>>;
        this._logs$.next(parsed.map(normalizeLog));
        return;
      } catch {
        // fall through to mock load
      }
    }
 
    this.http.get<Array<Partial<AuditLog>>>('assets/mock/audit.json').subscribe({
      next: (data) => {
        const logs = (data ?? []).map(normalizeLog);
        this._logs$.next(logs);
        this.persist();
      },
      error: () => {
        const fallback: AuditLog[] = [
          normalizeLog({
            auditID: 'AU-9001',
            aircraftID: 'AT-1001',
            findings: 'Initial safety check - minor issue in landing lights',
            status: 'PENDING',
          }),
        ];
        this._logs$.next(fallback);
        this.persist();
      }
    });
  }
 
  /** Persist entire list to localStorage */
  private persist(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._logs$.getValue()));
    } catch (e) {
      console.error('Failed to persist audit logs', e);
    }
  }
 
  // -------- Public API --------
 
  list(): Observable<AuditLog[]> {
    return this._logs$.asObservable();
  }
 
  getValue(): AuditLog[] {
    return this._logs$.getValue();
  }
 
  getById(id: string): AuditLog | undefined {
    return this.getValue().find((x) => x.auditID === id);
  }
 
  add(log: AuditLog): void {
    const arr = this.getValue();
    if (arr.some((x) => x.auditID === log.auditID)) {
      throw new Error('AuditID must be unique');
    }
    this._logs$.next([...arr, normalizeLog(log)]);
    this.persist();
  }
 
  update(id: string, changes: Partial<AuditLog>): void {
    this._logs$.next(
      this.getValue().map((x) =>
        x.auditID === id ? normalizeLog({ ...x, ...changes }) : x
      )
    );
    this.persist();
  }
 
  remove(id: string): void {
    this._logs$.next(this.getValue().filter((x) => x.auditID !== id));
    this.persist();
  }
 
  /** Set status via dropdown and manage resolvedDate */
  setStatus(id: string, status: Status): void {
    const today = new Date().toISOString().slice(0, 10);
 
    const updated = this.getValue().map((x) => {
      if (x.auditID !== id) return x;
 
      if (status === 'RESOLVED') {
        return {
          ...x,
          status: 'RESOLVED' as const,
          resolvedDate: x.resolvedDate ?? today,
        };
      } else {
        return {
          ...x,
          status: 'PENDING' as const,
          resolvedDate: undefined,
        };
      }
    });
 
    this._logs$.next(updated);
    this.persist();
  }
 
  /**
   * Toggle via button (if you keep one):
   * - PENDING -> RESOLVED (sets resolvedDate to today if not set)
   * - RESOLVED -> PENDING (clears resolvedDate)
   */
  toggleResolved(id: string): void {
    const today = new Date().toISOString().slice(0, 10);
 
    const updated = this.getValue().map((x) => {
      if (x.auditID !== id) return x;
 
      if (x.status === 'RESOLVED') {
        return { ...x, status: 'PENDING' as const, resolvedDate: undefined };
      } else {
        return {
          ...x,
          status: 'RESOLVED' as const,
          resolvedDate: x.resolvedDate ?? today,
        };
      }
    });
 
    this._logs$.next(updated);
    this.persist();
  }
 
  /** CSV export including Status + AuditCreated + ResolvedOn */
  exportComplianceCSV(): Blob {
    const rows: string[][] = [
      ['AuditID', 'AircraftID', 'Findings', 'Status', 'AuditCreated', 'ResolvedOn'],
    ];
 
    for (const x of this.getValue()) {
      const findings = (x.findings ?? '').replace(/\n/g, ' ').trim();
      rows.push([
        x.auditID,
        x.aircraftID,
        findings,
        x.status ?? 'PENDING',
        x.date ?? '',
        x.resolvedDate ?? '',
      ]);
    }
 
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
 
    return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  }
}