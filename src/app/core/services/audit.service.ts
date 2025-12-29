import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AuditLog } from "../../core/models/audit-log.model";
import { HttpClient } from "@angular/common/http";

// src/app/core/services/audit.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuditLog, Status } from '../../core/models/audit-log.model';
import { HttpClient } from '@angular/common/http';

const STORAGE_KEY = 'aerotrack.audit';

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

  constructor(private http: HttpClient) { this.initialize(); }

const STORAGE_KEY = "aerotrack.audit";

@Injectable({ providedIn: "root" })
export class AuditService {
  private readonly _logs$ = new BehaviorSubject<AuditLog[]>([]);
  constructor(private http: HttpClient) {
    this.initialize();
  }

  private initialize() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Array<Partial<AuditLog>>;
        this._logs$.next(parsed.map(normalizeLog));
        return;
      } catch { /* fall through */ }
    }
    this.http.get<Array<Partial<AuditLog>>>('assets/mock/audit.json').subscribe({
      next: (data) => { this._logs$.next((data ?? []).map(normalizeLog)); this.persist(); },
      error: () => {
        this._logs$.next([
          normalizeLog({
            auditID: 'AU-9001',
            aircraftID: 'AT-1001',
            findings: 'Initial safety check - minor issue in landing lights',
            status: 'PENDING',
          })
        ]);
        this.persist();
      }
    });
  }

  private persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(this._logs$.getValue())); }
    catch (e) { console.error('Failed to persist audit logs', e); }
  }

  list(): Observable<AuditLog[]> { return this._logs$.asObservable(); }
  getValue(): AuditLog[] { return this._logs$.getValue(); }
  getById(id: string) { return this.getValue().find(x => x.auditID === id); }

  add(log: AuditLog) {
    const arr = this.getValue();
    if (arr.some(x => x.auditID === log.auditID)) throw new Error('AuditID must be unique');
    this._logs$.next([...arr, normalizeLog(log)]);
    this.persist();
  }

  update(id: string, changes: Partial<AuditLog>) {
    this._logs$.next(this.getValue().map(x => x.auditID === id ? normalizeLog({ ...x, ...changes }) : x));
    this.persist();
  }

  remove(id: string) {
    this._logs$.next(this.getValue().filter(x => x.auditID !== id));
    this.persist();
  }

  /** Toggle via button */
  toggleResolved(id: string) {
    const today = new Date().toISOString().slice(0, 10);
    const updated = this.getValue().map(x => {
      if (x.auditID !== id) return x;
      if (x.status === 'RESOLVED') {
        return { ...x, status: 'PENDING' as const, resolvedDate: undefined };
      } else {
        return { ...x, status: 'RESOLVED' as const, resolvedDate: x.resolvedDate ?? today };
      }
    });
    this._logs$.next(updated);
    this.persist();
  }

  /** Set status via dropdown */
  setStatus(id: string, status: Status) {
    const today = new Date().toISOString().slice(0, 10);
    const updated = this.getValue().map(x => {
      if (x.auditID !== id) return x;
      if (status === 'RESOLVED') {
        return { ...x, status: 'RESOLVED' as const, resolvedDate: x.resolvedDate ?? today };
      } else {
        return { ...x, status: 'PENDING' as const, resolvedDate: undefined };
      }
    });
    this._logs$.next(updated);
    this.persist();
  }

  /** CSV includes Status + AuditCreated + ResolvedOn */
  exportComplianceCSV(): Blob {
    const rows: string[][] = [['AuditID', 'AircraftID', 'Findings', 'Status', 'AuditCreated', 'ResolvedOn']];
    for (const x of this.getValue()) {
      const findings = (x.findings ?? '').replace(/\n/g, ' ').trim();
      rows.push([x.auditID, x.aircraftID, findings, x.status ?? 'PENDING', x.date ?? '', x.resolvedDate ?? '']);
    }
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        this._logs$.next(JSON.parse(cached));
        return;
      } catch {}
    }
    this.http.get<AuditLog[]>("assets/mock/audit.json").subscribe({
      next: (d) => {
        this._logs$.next(d);
        this.persist();
      },
      error: () => {
        const fallback: AuditLog[] = [
          {
            auditID: "AU-9001",
            aircraftID: "AT-1001",
            findings: "Initial safety check - minor issue in landing lights",
            date: new Date().toISOString().slice(0, 10),
          },
        ];
        this._logs$.next(fallback);
        this.persist();
      },
    });
  }
  persist() {
    throw new Error("Method not implemented.");
  }

  list(): Observable<AuditLog[]> {
    return this._logs$.asObservable();
  }
  getValue(): AuditLog[] {
    return this._logs$.getValue();
  }
  getById(id: string) {
    return this.getValue().find((x) => x.auditID === id);
  }

  add(log: AuditLog) {
    const arr = this.getValue();
    if (arr.some((x) => x.auditID === log.auditID))
      throw new Error("AuditID must be unique");
    this._logs$.next([...arr, log]);
    this.persist();
  }
  update(id: string, changes: Partial<AuditLog>) {
    this._logs$.next(
      this.getValue().map((x) => (x.auditID === id ? { ...x, ...changes } : x))
    );
    this.persist();
  }
  remove(id: string) {
    this._logs$.next(this.getValue().filter((x) => x.auditID !== id));
    this.persist();
  }

  markCorrectiveAction(id: string) {
    // For demo, append a note to findings
    const updated = this.getValue().map((x) =>
      x.auditID === id
        ? { ...x, findings: x.findings + " | Corrective action: RESOLVED" }
        : x
    );
    this._logs$.next(updated);
    this.persist();
  }

  exportComplianceCSV(): Blob {
    const rows = [["AuditID", "AircraftID", "Findings", "Date"]];

    for (const x of this.getValue()) {
      // Replace newlines in findings with a space so the CSV stays one line per row
      const safeFindings = x.findings.replace(/\n/g, " ");
      rows.push([x.auditID, x.aircraftID, safeFindings, x.date]);
    }

    // Escape double quotes and join rows by newline
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    return new Blob([csv], { type: "text/csv;charset=utf-8;" });
  }
}
