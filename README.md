
# AeroTrack — Frontend (Aircraft + Maintenance + Spares + Audit + Reports)

This Angular app now includes:
- **Aircraft Registration & Lifecycle**
- **Maintenance Scheduling & Workflow**
- **Spare Parts Inventory & Procurement**
- **Compliance & Safety Audit Tracking**
- **Fleet Performance Analytics & Reporting**

## UI Improvements
- Sidebar navigation with groups (Core, Ops)
- KPI cards on Reports dashboard
- Enhanced badges & buttons

## Run
```bash
npm install
ng serve
```
Open http://localhost:4200

## Notes
- Frontend-only, mock data from `src/assets/mock/*.json`, persisted to `localStorage`.
- Simple CSV exports for compliance & fleet reports.
- IDs pattern: `AA-0000` across entities.
