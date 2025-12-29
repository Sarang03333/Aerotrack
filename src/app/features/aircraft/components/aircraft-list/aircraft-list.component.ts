import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AircraftService } from "../../../../core/services/aircraft.service";
import {
  Aircraft,
  AircraftCategory,
  ComplianceStatus,
} from "../../../../core/models/aircraft.model";

@Component({
  selector: "app-aircraft-list",
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: "./aircraft-list.component.html",
})
export class AircraftListComponent implements OnInit {
  term = "";
  category: AircraftCategory | "" = "";
  compliance: ComplianceStatus | "" = "";
  aircraft: Aircraft[] = [];
  categories: AircraftCategory[] = ["Commercial", "Defense", "Cargo"];
  compliances: ComplianceStatus[] = ["Compliant", "Pending", "Non-Compliant"];
  constructor(private svc: AircraftService) {}
  ngOnInit() {
    this.refresh();
    this.svc.list().subscribe(() => this.refresh());
  }
  refresh() {
    this.aircraft = this.svc.filter(
      this.term,
      this.category || undefined,
      this.compliance || undefined
    );
  }
  clearFilters() {
    this.term = "";
    this.category = "";
    this.compliance = "";
    this.refresh();
  }
  lastServiceDate(a: Aircraft) {
    if (!a.serviceHistory?.length) return "—";
    const s = [...a.serviceHistory].sort((x, y) =>
      x.date.localeCompare(y.date)
    );
    return s[s.length - 1].date;
  }
  remove(id: string) {
    if (confirm(`Delete aircraft ${id}?`)) this.svc.remove(id);
  }
}
