
import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
  },

  {
    path: 'dashboards',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/dashboards/dashboards-page/dashboards-page.component')
        .then(m => m.DashboardsPageComponent),
  },

  {
    path: 'aircraft',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/aircraft/components/aircraft-list/aircraft-list.component')
        .then(m => m.AircraftListComponent),
  },
  {
    path: 'aircraft/new',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/aircraft/components/aircraft-form/aircraft-form.component')
        .then(m => m.AircraftFormComponent),
  },
  {
    path: 'aircraft/:id',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/aircraft/components/aircraft-detail/aircraft-detail.component')
        .then(m => m.AircraftDetailComponent),
  },
  {
    path: 'aircraft/:id/edit',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/aircraft/components/aircraft-form/aircraft-form.component')
        .then(m => m.AircraftFormComponent),
  },

  {
    path: 'maintenance',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/maintenance/components/maintenance-list/maintenance-list.component')
        .then(m => m.MaintenanceListComponent),
  },
  {
    path: 'maintenance/new',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/maintenance/components/maintenance-form/maintenance-form.component')
        .then(m => m.MaintenanceFormComponent),
  },
  {
    path: 'maintenance/:id/edit',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/maintenance/components/maintenance-form/maintenance-form.component')
        .then(m => m.MaintenanceFormComponent),
  },

  {
    path: 'spares',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/spares/components/spares-list/spares-list.component')
        .then(m => m.SparesListComponent),
  },
  {
    path: 'spares/new',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/spares/components/spares-form/spares-form.component')
        .then(m => m.SparesFormComponent),
  },
  {
    path: 'spares/:id/edit',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/spares/components/spares-form/spares-form.component')
        .then(m => m.SparesFormComponent),
  },

  {
    path: 'audit',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/audit/components/audit-list/audit-list.component')
        .then(m => m.AuditListComponent),
  },
  {
    path: 'audit/new',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/audit/components/audit-form/audit-form.component')
        .then(m => m.AuditFormComponent),
  },
  {
    path: 'audit/:id/edit',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/audit/components/audit-form/audit-form.component')
        .then(m => m.AuditFormComponent),
  },

  {
    path: 'reports',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./features/reports/components/reports-dashboard/reports-dashboard.component')
        .then(m => m.ReportsDashboardComponent),
  },

  { path: '**', redirectTo: 'login' }
];
