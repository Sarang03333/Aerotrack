
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';

// ---- Auth (class-based guard + login page) ----
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './pages/login/login.component';

// ---- Dashboards ----
import { DashboardsPageComponent } from './features/dashboards/dashboards-page/dashboards-page.component';

// ---- Aircraft ----
import { AircraftListComponent } from './features/aircraft/components/aircraft-list/aircraft-list.component';
import { AircraftFormComponent } from './features/aircraft/components/aircraft-form/aircraft-form.component';
import { AircraftDetailComponent } from './features/aircraft/components/aircraft-detail/aircraft-detail.component';

// ---- Maintenance ----
import { MaintenanceListComponent } from './features/maintenance/components/maintenance-list/maintenance-list.component';
import { MaintenanceFormComponent } from './features/maintenance/components/maintenance-form/maintenance-form.component';

// ---- Spares ----
import { SparesListComponent } from './features/spares/components/spares-list/spares-list.component';
import { SparesFormComponent } from './features/spares/components/spares-form/spares-form.component';

// ---- Audit ----
import { AuditListComponent } from './features/audit/components/audit-list/audit-list.component';
import { AuditFormComponent } from './features/audit/components/audit-form/audit-form.component';

// ---- Reports ----
import { ReportsDashboardComponent } from './features/reports/components/reports-dashboard/reports-dashboard.component';

export const routes: Routes = [
  // Default → Login
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  // Public: Login page
  { path: 'login', component: LoginComponent },

  // Dashboards
  { path: 'dashboards',           canActivate: [AuthGuard], component: DashboardsPageComponent },

  // Aircraft
  { path: 'aircraft',             canActivate: [AuthGuard], component: AircraftListComponent },
  { path: 'aircraft/new',         canActivate: [AuthGuard], component: AircraftFormComponent },
  { path: 'aircraft/:id',         canActivate: [AuthGuard], component: AircraftDetailComponent },
  { path: 'aircraft/:id/edit',    canActivate: [AuthGuard], component: AircraftFormComponent },

  // Maintenance
  { path: 'maintenance',          canActivate: [AuthGuard], component: MaintenanceListComponent },
  { path: 'maintenance/new',      canActivate: [AuthGuard], component: MaintenanceFormComponent },
  { path: 'maintenance/:id/edit', canActivate: [AuthGuard], component: MaintenanceFormComponent },

  // Spares
  { path: 'spares',               canActivate: [AuthGuard], component: SparesListComponent },
  { path: 'spares/new',           canActivate: [AuthGuard], component: SparesFormComponent },
  { path: 'spares/:id/edit',      canActivate: [AuthGuard], component: SparesFormComponent },

  // Audit & Compliance
  { path: 'audit',                canActivate: [AuthGuard], component: AuditListComponent },
  { path: 'audit/new',            canActivate: [AuthGuard], component: AuditFormComponent },
  { path: 'audit/:id/edit',       canActivate: [AuthGuard], component: AuditFormComponent },

  // Fleet analytics & reporting
  { path: 'reports',              canActivate: [AuthGuard], component: ReportsDashboardComponent },

  // Fallback
  { path: '**', redirectTo: 'login' }
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),

  ]
};
