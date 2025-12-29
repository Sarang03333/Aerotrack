import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { RouterModule, ActivatedRoute, Router } from "@angular/router";
import { SparesService } from "../../../../core/services/spares.service";
import { SparePart } from "../../../../core/models/spare-part.model";

@Component({
  selector: "app-spares-form",
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./spares-form.component.html",
})
export class SparesFormComponent implements OnInit {
  isEdit = false;
  form = this.fb.group({
    partID: ["", [Validators.required, Validators.pattern(/^[A-Z]{2}-\d{4}$/)]],
    name: ["", [Validators.required, Validators.minLength(2)]],
    quantityAvailable: [0, [Validators.required, Validators.min(0)]],
    reorderLevel: [0, [Validators.required, Validators.min(0)]],
    lastUpdated: [new Date().toISOString().slice(0, 10), [Validators.required]],
  });
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private svc: SparesService
  ) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id) {
      const p = this.svc.getById(id);
      if (p) {
        this.isEdit = true;
        this.form.patchValue(p);
        this.form.controls.partID.disable();
      }
    }
  }
  submit() {
    if (this.form.invalid) return;
    const v = this.form.getRawValue() as SparePart;
    try {
      if (this.isEdit) {
        this.svc.update(v.partID, v);
      } else {
        this.svc.add(v);
      }
      this.router.navigate(["/spares"]);
    } catch (e: any) {
      alert(e.message || "Error");
    }
  }
}
