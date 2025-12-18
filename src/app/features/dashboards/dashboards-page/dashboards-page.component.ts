
import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import Chart from 'chart.js/auto';
import { Subscription } from 'rxjs';

// Your existing services from aerotrack-angular-plus
import { MaintenanceService } from '../../../core/services/maintenance.service';
import { AircraftService } from '../../../core/services/aircraft.service';
import { SparesService } from '../../../core/services/spares.service';
import { AuditService } from '../../../core/services/audit.service';
import { ReportsService } from '../../../core/services/reports.service';

@Component({
  selector: 'app-dashboards-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboards-page.component.html',
  styleUrls: ['./dashboards-page.component.css']
})
export class DashboardsPageComponent implements AfterViewInit, OnDestroy {

  // ----- Maintenance charts -----
  @ViewChild('maintBar')    maintBar!: ElementRef<HTMLCanvasElement>;
  @ViewChild('maintDonut')  maintDonut!: ElementRef<HTMLCanvasElement>;
  @ViewChild('maintLine')   maintLine!: ElementRef<HTMLCanvasElement>;

  private maintBarChart?: Chart;
  private maintDonutChart?: Chart;
  private maintLineChart?: Chart;

  // ----- Admin charts -----
  @ViewChild('aircatBar')   aircatBar!: ElementRef<HTMLCanvasElement>;
  @ViewChild('compDonut')   compDonut!: ElementRef<HTMLCanvasElement>;
  @ViewChild('sparesDonut') sparesDonut!: ElementRef<HTMLCanvasElement>;

  private aircatBarChart?: Chart;
  private compDonutChart?: Chart;
  private sparesDonutChart?: Chart;

  // KPI cards
  kpi = this.reports.generate();

  private subs: Subscription[] = [];

  constructor(
    private maintenanceSvc: MaintenanceService,
    private aircraftSvc: AircraftService,
    private sparesSvc: SparesService,
    private auditSvc: AuditService,
    private reports: ReportsService
  ) {}

  ngAfterViewInit(): void {
    // Initialize charts once canvases are available
    this.initMaintenanceCharts();
    this.initAdminCharts();

    // Reactive updates from services
    this.subs.push(
      this.maintenanceSvc.list().subscribe(tasks => {
        const pending = tasks.filter(t => t.status === 'PENDING').length;
        const inprog  = tasks.filter(t => t.status === 'IN_PROGRESS').length;
        const done    = tasks.filter(t => t.status === 'COMPLETED').length;

        // Maintenance status bar
        this.maintBarChart!.data.labels = ['Pending', 'In Progress', 'Completed'];
        this.maintBarChart!.data.datasets[0].data = [pending, inprog, done];
        this.maintBarChart!.update();

        // Maintenance status doughnut
        this.maintDonutChart!.data.labels = ['Pending', 'In Progress', 'Completed'];
        (this.maintDonutChart!.data.datasets[0].data as number[]) = [pending, inprog, done];
        this.maintDonutChart!.update();

        // Maintenance trend line (by scheduledDate)
        const perDay = new Map<string, number>();
        tasks.forEach(t => {
          const d = (t.scheduledDate || '').slice(0, 10);
          perDay.set(d, (perDay.get(d) || 0) + 1);
        });
        const labels = Array.from(perDay.keys()).sort();
        this.maintLineChart!.data.labels = labels;
        (this.maintLineChart!.data.datasets[0].data as number[]) = labels.map(l => perDay.get(l) || 0);
        this.maintLineChart!.update();

        // KPIs recompute
        this.kpi = this.reports.generate();
      })
    );

    this.subs.push(
      this.aircraftSvc.list().subscribe(list => {
        const commercial = list.filter(a => a.category === 'Commercial').length;
        const defense    = list.filter(a => a.category === 'Defense').length;
        const cargo      = list.filter(a => a.category === 'Cargo').length;

        // Aircraft category bar
        this.aircatBarChart!.data.labels = ['Commercial', 'Defense', 'Cargo'];
        (this.aircatBarChart!.data.datasets[0].data as number[]) = [commercial, defense, cargo];
        this.aircatBarChart!.update();

        const compliant    = list.filter(a => a.complianceStatus === 'Compliant').length;
        const pendingComp  = list.filter(a => a.complianceStatus === 'Pending').length;
        const nonCompliant = list.filter(a => a.complianceStatus === 'Non-Compliant').length;

        // Compliance doughnut
        this.compDonutChart!.data.labels = ['Compliant', 'Pending', 'Non-Compliant'];
        (this.compDonutChart!.data.datasets[0].data as number[]) = [compliant, pendingComp, nonCompliant];
        this.compDonutChart!.update();
      })
    );

    this.subs.push(
      this.sparesSvc.list().subscribe(parts => {
        const low = parts.filter(p => p.quantityAvailable <= p.reorderLevel).length;
        const ok  = parts.length - low;

        // Spares health doughnut
        this.sparesDonutChart!.data.labels = ['LOW', 'OK'];
        (this.sparesDonutChart!.data.datasets[0].data as number[]) = [low, ok];
        this.sparesDonutChart!.update();
      })
    );
  }

  private initMaintenanceCharts(): void {
    // Status bar
    this.maintBarChart = new Chart(this.maintBar.nativeElement, {
      type: 'bar',
      data: { labels: [], datasets: [{ label: 'Tasks', data: [], backgroundColor: ['#ffc107', '#fd7e14', '#198754'] }] },
      options: { responsive: true, plugins: { legend: { display: true } } }
    });

    // Status doughnut
    this.maintDonutChart = new Chart(this.maintDonut.nativeElement, {
      type: 'doughnut',
      data: { labels: [], datasets: [{ data: [], backgroundColor: ['#ffe38a', '#feb27c', '#74c69d'], borderColor: ['#ffc107', '#fd7e14', '#198754'] }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    // Trend line
    this.maintLineChart = new Chart(this.maintLine.nativeElement, {
      type: 'line',
      data: { labels: [], datasets: [{ label: 'Tasks per Day', data: [], borderColor: '#0b5ed7', backgroundColor: 'rgba(11,94,215,0.2)', tension: 0.2, fill: true }] },
      options: { responsive: true, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: true } } }
    });
  }

  private initAdminCharts(): void {
    // Aircraft category bar
    this.aircatBarChart = new Chart(this.aircatBar.nativeElement, {
      type: 'bar',
      data: { labels: [], datasets: [{ label: 'Aircraft', data: [], backgroundColor: ['#0b5ed7','#6f42c1','#20c997'] }] },
      options: { responsive: true, plugins: { legend: { display: false } } }
    });

    // Compliance doughnut
    this.compDonutChart = new Chart(this.compDonut.nativeElement, {
      type: 'doughnut',
      data: { labels: [], datasets: [{ data: [], backgroundColor: ['#198754','#ffc107','#dc3545'], borderColor: ['#198754','#ffc107','#dc3545'] }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });

    // Spares health doughnut
    this.sparesDonutChart = new Chart(this.sparesDonut.nativeElement, {
      type: 'doughnut',
      data: { labels: [], datasets: [{ data: [], backgroundColor: ['#dc3545','#198754'], borderColor: ['#dc3545','#198754'] }] },
      options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    // Destroy charts to free canvas/webgl contexts (optional but good hygiene)
    this.maintBarChart?.destroy();
    this.maintDonutChart?.destroy();
    this.maintLineChart?.destroy();
    this.aircatBarChart?.destroy();
    this.compDonutChart?.destroy();
    this.sparesDonutChart?.destroy();
  }
}
