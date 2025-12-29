import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { RouterModule, ActivatedRoute, Router } from "@angular/router";
import { AircraftService } from "../../../../core/services/aircraft.service";
import {
  Aircraft,
  AircraftCategory,
  ComplianceStatus,
} from "../../../../core/models/aircraft.model";

@Component({
  selector: "app-aircraft-form",
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./aircraft-form.component.html",
})
export class AircraftFormComponent implements OnInit {
  isEdit = false;
  categories: AircraftCategory[] = ["Commercial", "Defense", "Cargo"];
  compliances: ComplianceStatus[] = ["Compliant", "Pending", "Non-Compliant"];
  form = this.fb.group({
    aircraftID: [
      "",
      [Validators.required, Validators.pattern(/^[A-Z]{2}-\d{4}$/)],
    ],
    model: ["", [Validators.required, Validators.minLength(3)]],
    category: ["Commercial" as AircraftCategory, [Validators.required]],
    complianceStatus: ["Pending" as ComplianceStatus, [Validators.required]],
  });
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: AircraftService
  ) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      const a = this.svc.getById(id);
      if (a) {
        this.isEdit = true;
        this.form.patchValue({
          aircraftID: a.aircraftID,
          model: a.model,
          category: a.category,
          complianceStatus: a.complianceStatus,
        });
        this.form.controls.aircraftID.disable();
      }
    }
  }
  submit() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue() as Aircraft;
    try {
      if (this.isEdit) {
        this.svc.update(v.aircraftID, {
          model: v.model,
          category: v.category,
          complianceStatus: v.complianceStatus,
        });
      } else {
        this.svc.add({ ...v, serviceHistory: [] });
      }
      this.router.navigate(["/aircraft"]);
    } catch (e: any) {
      alert(e.message || "Error");
    }
  }
}
