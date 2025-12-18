
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { AuditService } from '../../../../core/services/audit.service';
import { AuditLog } from '../../../../core/models/audit-log.model';

@Component({ selector:'app-audit-form', standalone:true, imports:[CommonModule,ReactiveFormsModule,RouterModule], templateUrl:'./audit-form.component.html' })
export class AuditFormComponent implements OnInit {
  isEdit=false;
  form=this.fb.group({ auditID:['',[Validators.required,Validators.pattern(/^[A-Z]{2}-\d{4}$/)]], aircraftID:['',[Validators.required]], findings:['',[Validators.required,Validators.minLength(3)]], date:[new Date().toISOString().slice(0,10),[Validators.required]] });
  constructor(private fb:FormBuilder, private route:ActivatedRoute, private router:Router, private svc:AuditService){}
  ngOnInit(){ const id=this.route.snapshot.paramMap.get('id'); if(id){ const x=this.svc.getById(id); if(x){ this.isEdit=true; this.form.patchValue(x); this.form.controls.auditID.disable(); } } }
  submit(){ if(this.form.invalid) return; const v=this.form.getRawValue() as AuditLog; try{ if(this.isEdit){ this.svc.update(v.auditID,v); } else { this.svc.add(v); } this.router.navigate(['/audit']); } catch(e:any){ alert(e.message||'Error'); } }
}
