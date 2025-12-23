
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MaintenanceService } from '../../../../core/services/maintenance.service';
import { MaintenanceTask, TaskStatus } from '../../../../core/models/maintenance-task.model';
import { AircraftService } from '../../../../core/services/aircraft.service';

@Component({ selector:'app-maintenance-list', standalone:true, imports:[CommonModule,FormsModule,RouterModule], templateUrl:'./maintenance-list.component.html' })
export class MaintenanceListComponent implements OnInit {
  term=''; status:TaskStatus|''='';
  tasks:MaintenanceTask[]=[];
  statuses:TaskStatus[]=['PENDING','IN_PROGRESS','COMPLETED'];
  aircraftIDs:string[]=[];
  selectedAircraftForEmergency='';
  constructor(private svc:MaintenanceService, private aircraftSvc:AircraftService){}

  ngOnInit()
  { this.refresh(); this.svc.list().subscribe(()=>this.refresh());
     this.aircraftSvc.list().subscribe(()=>
      { 
        this.aircraftIDs=this.aircraftSvc.ids();
      });
   }

  refresh()
  { this.tasks=this.svc.filter(this.term,this.status||undefined); }

  clearFilters()
  { this.term=''; this.status=''; this.refresh(); }

  start(id:string)
  { this.svc.setStatus(id,'IN_PROGRESS'); }

  complete(id:string)
  { this.svc.setStatus(id,'COMPLETED'); }

  remove(id:string)
  { if(confirm(`Delete task ${id}?`)) this.svc.remove(id); }

  createEmergency()
  { if(!this.selectedAircraftForEmergency)
    { alert('Select an AircraftID for emergency'); return; } 
    const task=this.svc.createEmergency(this.selectedAircraftForEmergency); this.svc.add(task); }
}
