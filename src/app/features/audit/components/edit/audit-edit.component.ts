
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditService } from '../../../../core/services/audit.service';
import { AuditLog, Status } from '../../../../core/models/audit-log.model';
@Component({
  selector: 'app-audit-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-edit.component.html'
})
export class AuditEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private svc = inject(AuditService);

  audit = signal<AuditLog | null>(null);
  auditId = computed(() => this.audit()?.auditID ?? '');

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('Invalid route: missing audit ID');
      this.router.navigate(['/audit']);
      return;
    }
    const found = this.svc.getById(id);
    if (!found) {
      alert(`Audit ${id} not found`);
      this.router.navigate(['/audit']);
      return;
    }
    
    this.audit.set({ ...found });
  }

  onStatusChange(next: Status) {
    const a = this.audit();
    if (!a) return;

    if (next === 'RESOLVED' && a.status !== 'RESOLVED') {
      const today = new Date().toISOString().slice(0, 10);
      this.audit.set({ ...a, status: next, resolvedDate: a.resolvedDate ?? today });
    } else if (next === 'PENDING' && a.status !== 'PENDING') {
      this.audit.set({ ...a, status: next, resolvedDate: undefined });
    } else {
      this.audit.set({ ...a, status: next });
    }
  }

  save(form: NgForm) {
    if (!form.valid || !this.audit()) return;
    const a = this.audit()!;
    this.svc.update(a.auditID, {
      aircraftID: a.aircraftID,
      findings: a.findings,
      status: a.status,
      date: a.date,
      resolvedDate: a.resolvedDate
    });
    alert('Audit saved');
    this.router.navigate(['/audit']);
  }

  cancel() {
    this.router.navigate(['/audit']);
  }
}
