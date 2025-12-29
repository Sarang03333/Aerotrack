import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AuditLog } from "../../core/models/audit-log.model";
import { HttpClient } from "@angular/common/http";

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
