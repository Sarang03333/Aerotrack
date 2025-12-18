
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsService } from '../../../../core/services/reports.service';

@Component({ selector:'app-reports-dashboard', standalone:true, imports:[CommonModule], templateUrl:'./reports-dashboard.component.html' })
export class ReportsDashboardComponent {
  lastCSVUrl: string | null = null;
  report = this.reports.generate();
  constructor(private reports: ReportsService){}
  regenerate(){ this.report = this.reports.generate(); }
  export(){ const blob=this.reports.downloadCSV(this.report); const url=URL.createObjectURL(blob); this.lastCSVUrl=url; const a=document.createElement('a'); a.href=url; a.download=`fleet-report-${this.report.reportID}.csv`; a.click(); URL.revokeObjectURL(url); }
}
