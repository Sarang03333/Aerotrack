import { DashboardsPageComponent } from './features/dashboards/dashboards-page/dashboards-page.component';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, Routes } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

// Aircraft
import { AircraftListComponent } from './features/aircraft/components/aircraft-list/aircraft-list.component';
import { AircraftFormComponent } from './features/aircraft/components/aircraft-form/aircraft-form.component';
import { AircraftDetailComponent } from './features/aircraft/components/aircraft-detail/aircraft-detail.component';

// Maintenance
import { MaintenanceListComponent } from './features/maintenance/components/maintenance-list/maintenance-list.component';
import { MaintenanceFormComponent } from './features/maintenance/components/maintenance-form/maintenance-form.component';

// Spares
import { SparesListComponent } from './features/spares/components/spares-list/spares-list.component';
import { SparesFormComponent } from './features/spares/components/spares-form/spares-form.component';

// Audit
import { AuditListComponent } from './features/audit/components/audit-list/audit-list.component';
import { AuditFormComponent } from './features/audit/components/audit-form/audit-form.component';

// Reports
import { ReportsDashboardComponent } from './features/reports/components/reports-dashboard/reports-dashboard.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'aircraft' },
  { path: 'dashboards', component: DashboardsPageComponent },


  // Aircraft
  { path: 'aircraft', component: AircraftListComponent },
  { path: 'aircraft/new', component: AircraftFormComponent },
  { path: 'aircraft/:id', component: AircraftDetailComponent },
  { path: 'aircraft/:id/edit', component: AircraftFormComponent },

  // Maintenance
  { path: 'maintenance', component: MaintenanceListComponent },
  { path: 'maintenance/new', component: MaintenanceFormComponent },
  { path: 'maintenance/:id/edit', component: MaintenanceFormComponent },

  // Spares
  { path: 'spares', component: SparesListComponent },
  { path: 'spares/new', component: SparesFormComponent },
  { path: 'spares/:id/edit', component: SparesFormComponent },

  // Audit & Compliance
  { path: 'audit', component: AuditListComponent },
  { path: 'audit/new', component: AuditFormComponent },
  { path: 'audit/:id/edit', component: AuditFormComponent },

  // Fleet analytics & reporting
  { path: 'reports', component: ReportsDashboardComponent },

  { path: '**', redirectTo: 'aircraft' }
];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()]
};
