
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MaintenanceService } from '../../../../core/services/maintenance.service';
import { MaintenanceTask, TaskStatus } from '../../../../core/models/maintenance-task.model';
import { AircraftService } from '../../../../core/services/aircraft.service';

@Component({ selector:'app-maintenance-form', standalone:true, imports:[CommonModule,ReactiveFormsModule,RouterModule], templateUrl:'./maintenance-form.component.html' })
export class MaintenanceFormComponent implements OnInit {
  isEdit=false; 
  statuses:TaskStatus[]=['PENDING','IN_PROGRESS','COMPLETED'];
   aircraftIDs:string[]=[];
  form=this.fb.group({ taskID:['',[Validators.required,Validators.pattern(/^[A-Z]{2}-\d{4}$/)]],
  aircraftID:['',[Validators.required]], 
  scheduledDate:['',[Validators.required]], 
  status:['PENDING' as TaskStatus,[Validators.required]] });

  constructor(private fb:FormBuilder, private route:ActivatedRoute, private router:Router, private svc:MaintenanceService, private aircraftSvc:AircraftService){}
  ngOnInit()
  { this.aircraftSvc.list().subscribe(()=>
    { this.aircraftIDs=this.aircraftSvc.ids(); });
     const id=this.route.snapshot.paramMap.get('id');
      if(id){ const t=this.svc.getById(id); if(t){ this.isEdit=true;
      this.form.patchValue({ taskID:t.taskID, aircraftID:t.aircraftID, scheduledDate:t.scheduledDate, status:t.status });
      this.form.controls.taskID.disable();
     }
     } }

  submit(){ if(this.form.invalid) return; 
    const v=this.form.getRawValue() as MaintenanceTask; 
    try{ if(this.isEdit)
      { 
        this.svc.update(v.taskID,{ aircraftID:v.aircraftID, scheduledDate:v.scheduledDate, status:v.status });
      } 
     else
       { 
        this.svc.add(v); } this.router.navigate(['/maintenance']);
       } 
       catch(e:any){ alert(e.message||'Error'); 
        
       } 
      }
}
