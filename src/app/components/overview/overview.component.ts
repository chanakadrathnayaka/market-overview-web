import {Component, inject, OnInit} from '@angular/core';
import {IntradayChartComponent} from "../intraday-chart/intraday-chart.component";
import {NgForOf} from "@angular/common";
import {UserPreferenceService} from "../../services/user-preference.service";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [IntradayChartComponent, NgForOf],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {

  symbols: string[] = []
  userPreferenceService: UserPreferenceService = inject(UserPreferenceService);

  ngOnInit(): void {
    this.userPreferenceService.symbols().subscribe({
      next: (data: Set<string>) => {
        this.symbols = Array.from(data);
      }
    });
  }
}
