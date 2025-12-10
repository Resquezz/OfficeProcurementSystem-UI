import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  summary = this.dashboardService.summary;
  stats = this.dashboardService.stats;

  ngOnInit(): void {
    this.dashboardService.load();
  }
}