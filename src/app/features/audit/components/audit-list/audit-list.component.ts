
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuditService } from '../../../../core/services/audit.service';
import { AuditLog, Status } from '../../../../core/models/audit-log.model';

@Component({
  selector: 'app-audit-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './audit-list.component.html',
  styleUrls: ['./audit-list.component.css']
})
export class AuditListComponent implements OnInit {
  term = '';
  logs: AuditLog[] = [];
  aircraftFilter = '';

  /** Inline modal state: null means closed */
  editing: AuditLog | null = null;

  constructor(private svc: AuditService) {}

import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { AuditService } from "../../../../core/services/audit.service";
import { AuditLog } from "../../../../core/models/audit-log.model";

@Component({
  selector: "app-audit-list",
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./audit-list.component.html",
})
export class AuditListComponent implements OnInit {
  term = "";
  logs: AuditLog[] = [];
  aircraftFilter = "";
  constructor(private svc: AuditService) {}
  ngOnInit() {
    this.refresh();
    this.svc.list().subscribe(() => this.refresh());
  }

  refresh() {
    const t = (this.term || '').toLowerCase();
    const filterId = this.aircraftFilter || '';
    this.logs = this.svc.getValue().filter(x => {
      const auditID = (x.auditID || '').toLowerCase();
      const aircraftID = (x.aircraftID || '').toLowerCase();
      const findings = (x.findings || '').toLowerCase();
      const matchesTerm = !t || auditID.includes(t) || findings.includes(t) || aircraftID.includes(t);
      const matchesAircraft = !filterId || x.aircraftID === filterId;
      return matchesTerm && matchesAircraft;
    });
  }

  clear() { this.term = ''; this.aircraftFilter = ''; this.refresh(); }

  remove(id: string) {
    if (confirm(`Delete audit ${id}?`)) {
      this.svc.remove(id);
      this.refresh();
    }
  }

  /** Inline status dropdown handler */
  onStatusSelect(id: string, next: Status) {
    // Uses your service helper; falls back to update if needed
    if (this.svc.setStatus) {
      this.svc.setStatus(id, next);
    } else {
      const today = new Date().toISOString().slice(0, 10);
      const row = this.svc.getById(id);
      if (!row) return;
      const changes: Partial<AuditLog> =
        next === 'RESOLVED'
          ? { status: 'RESOLVED', resolvedDate: row.resolvedDate ?? today }
          : { status: 'PENDING', resolvedDate: undefined };
      this.svc.update(id, changes);
    }
    this.refresh();
  }

  /** Open inline modal with a shallow copy of the row */
  openEdit(row: AuditLog) {
    this.editing = { ...row };
  }

  /** Save from inline modal */
  saveEdit() {
    if (!this.editing) return;

    // Auto-manage resolvedDate according to status selection
    const next: Status = this.editing.status ?? 'PENDING';
    const today = new Date().toISOString().slice(0, 10);

    if (next === 'RESOLVED' && !this.editing.resolvedDate) {
      this.editing.resolvedDate = today;
    }
    if (next === 'PENDING') {
      this.editing.resolvedDate = undefined;
    }

    this.svc.update(this.editing.auditID, this.editing);
    this.editing = null;
    this.refresh();
  }

  /** Cancel inline modal */
  cancelEdit() { this.editing = null; }

  export() {
    const blob = this.svc.exportComplianceCSV();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'compliance-report.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  trackByAuditId(_: number, item: AuditLog) { return item.auditID; }
  refresh() {
    const t = (this.term || "").toLowerCase();
    this.logs = this.svc.getValue().filter((x) => {
      const m1 =
        !t ||
        x.auditID.toLowerCase().includes(t) ||
        x.findings.toLowerCase().includes(t) ||
        x.aircraftID.toLowerCase().includes(t);
      const m2 = !this.aircraftFilter || x.aircraftID === this.aircraftFilter;
      return m1 && m2;
    });
  }
  clear() {
    this.term = "";
    this.aircraftFilter = "";
    this.refresh();
  }
  remove(id: string) {
    if (confirm(`Delete audit ${id}?`)) this.svc.remove(id);
    this.refresh();
  }
  resolve(id: string) {
    this.svc.markCorrectiveAction(id);
    this.refresh();
  }
  export() {
    const blob = this.svc.exportComplianceCSV();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "compliance-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  }
}
