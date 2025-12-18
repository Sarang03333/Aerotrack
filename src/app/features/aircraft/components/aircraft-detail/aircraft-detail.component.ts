
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AircraftService } from '../../../../core/services/aircraft.service';
import { Aircraft, ServiceEvent } from '../../../../core/models/aircraft.model';

@Component({ selector:'app-aircraft-detail', standalone:true, imports:[CommonModule,RouterModule,FormsModule], templateUrl:'./aircraft-detail.component.html' })
export class AircraftDetailComponent implements OnInit {
  aircraft?:Aircraft; date=''; description=''; performedBy='';
  constructor(private route:ActivatedRoute, private svc:AircraftService){}
  ngOnInit(){ const id=this.route.snapshot.paramMap.get('id')!; this.aircraft=this.svc.getById(id); }
  addEvent(){ if(!this.aircraft) return; if(!this.date||!this.description||!this.performedBy){ alert('All fields are required'); return; } const e:ServiceEvent={ id:`SE-${Math.random().toString(36).slice(2,8)}`, date:this.date, description:this.description, performedBy:this.performedBy }; this.svc.addServiceEvent(this.aircraft.aircraftID,e); this.aircraft=this.svc.getById(this.aircraft.aircraftID); this.date=''; this.description=''; this.performedBy=''; }
}
