import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SparesService } from "../../../../core/services/spares.service";
import { SparePart } from "../../../../core/models/spare-part.model";

@Component({
  selector: "app-spares-list",
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: "./spares-list.component.html",
})
export class SparesListComponent implements OnInit {
  term = "";
  lowOnly = false;
  parts: SparePart[] = [];
  constructor(private svc: SparesService) {}
  ngOnInit() {
    this.refresh();
    this.svc.list().subscribe(() => this.refresh());
  }
  refresh() {
    const t = (this.term || "").toLowerCase();
    const all = this.svc
      .getValue()
      .filter(
        (p) =>
          !t ||
          p.partID.toLowerCase().includes(t) ||
          p.name.toLowerCase().includes(t)
      );
    this.parts = this.lowOnly ? all.filter((p) => this.svc.isLowStock(p)) : all;
  }
  clear() {
    this.term = "";
    this.lowOnly = false;
    this.refresh();
  }
  replenish(id: string) {
    this.svc.replenish(id);
    this.refresh();
  }
  remove(id: string) {
    if (confirm(`Delete part ${id}?`)) this.svc.remove(id);
    this.refresh();
  }
  isLow(p: SparePart) {
    return this.svc.isLowStock(p);
  }
}
