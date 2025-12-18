
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuditService } from '../../../../core/services/audit.service';
import { AuditLog } from '../../../../core/models/audit-log.model';

@Component({ selector:'app-audit-list', standalone:true, imports:[CommonModule,FormsModule,RouterModule], templateUrl:'./audit-list.component.html' })
export class AuditListComponent implements OnInit {
  term=''; logs:AuditLog[]=[]; aircraftFilter='';
  constructor(private svc:AuditService){}
  ngOnInit(){ this.refresh(); this.svc.list().subscribe(()=>this.refresh()); }
  refresh(){ const t=(this.term||'').toLowerCase(); this.logs=this.svc.getValue().filter(x=>{ const m1=!t||x.auditID.toLowerCase().includes(t)||x.findings.toLowerCase().includes(t)||x.aircraftID.toLowerCase().includes(t); const m2=!this.aircraftFilter||x.aircraftID===this.aircraftFilter; return m1&&m2; }); }
  clear(){ this.term=''; this.aircraftFilter=''; this.refresh(); }
  remove(id:string){ if(confirm(`Delete audit ${id}?`)) this.svc.remove(id); this.refresh(); }
  resolve(id:string){ this.svc.markCorrectiveAction(id); this.refresh(); }
  export(){ const blob=this.svc.exportComplianceCSV(); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='compliance-report.csv'; a.click(); URL.revokeObjectURL(url); }
}
