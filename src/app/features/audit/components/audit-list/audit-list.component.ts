
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

  onStatusSelect(id: string, next: Status) {
    this.svc.setStatus(id, next);
    this.refresh();
  }
  export() {
    const blob = this.svc.exportComplianceCSV();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'compliance-report.csv'; a.click();
    URL.revokeObjectURL(url);
  }
  trackByAuditId(_: number, item: AuditLog) { return item.auditID; }
}
