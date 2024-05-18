import {Component, inject, OnInit} from '@angular/core';
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";
import {RealtimeChartComponent} from "../realtime-chart/realtime-chart.component";
import {UserPreferenceService} from "../../services/user-preference.service";
import {MatDividerModule} from "@angular/material/divider";

@Component({
  selector: 'app-realtime',
  standalone: true,
  imports: [MatListModule, MatGridListModule, MatDividerModule, RealtimeChartComponent],
  templateUrl: './realtime.component.html',
  styleUrl: './realtime.component.css'
})
export class RealtimeComponent implements OnInit {

  symbols: string[] = [];
  selectedSymbol: string | null = this.symbols[0];
  userPreferenceService: UserPreferenceService = inject(UserPreferenceService);

  ngOnInit(): void {
    this.userPreferenceService.symbols().subscribe({
      next: (data: Set<string>) => {
        this.symbols = Array.from(data);
        this.selectedSymbol = this.symbols[this.symbols.length - 1];
      }
    });
  }

  show(symbol: string) {
    this.selectedSymbol = symbol;
  }
}
