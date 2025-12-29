import { Injectable } from "@angular/core";
import { MaintenanceService } from "./maintenance.service";
import { AuditService } from "./audit.service";
import { FleetReport } from "../../core/models/fleet-report.model";

@Injectable({ providedIn: "root" })
export class ReportsService {
  constructor(private m: MaintenanceService, private a: AuditService) {}

  generate(): FleetReport {
    const tasks = this.m.getValue();
    const completed = tasks.filter((t) => t.status === "COMPLETED").length;
    const inprog = tasks.filter((t) => t.status === "IN_PROGRESS").length;
    const pending = tasks.filter((t) => t.status === "PENDING").length;
    const downtimeHours = inprog * 2 + pending * 4; // mock formula
    const costAnalysis = completed * 1200 + inprog * 800 + pending * 400; // mock costs
    const safetyPerformance = Math.max(0, 100 - this.a.getValue().length * 2); // mock metric
    const report: FleetReport = {
      reportID: `FR-${Math.floor(1000 + Math.random() * 9000)}`,
      metrics: { costAnalysis, safetyPerformance, downtimeHours },
      generatedDate: new Date().toISOString().slice(0, 10),
    };
    return report;
  }

  downloadCSV(report: FleetReport): Blob {
    const rows = [
      [
        "ReportID",
        "GeneratedDate",
        "CostAnalysis",
        "SafetyPerformance",
        "DowntimeHours",
      ],
      [
        report.reportID,
        report.generatedDate,
        String(report.metrics.costAnalysis),
        String(report.metrics.safetyPerformance),
        String(report.metrics.downtimeHours),
      ],
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");

    return new Blob([csv], { type: "text/csv;charset=utf-8;" });
  }
}
