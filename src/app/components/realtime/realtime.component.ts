import {Component, inject, OnInit} from '@angular/core';
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";
import {RealtimeChartComponent} from "../realtime-chart/realtime-chart.component";
import {MatDividerModule} from "@angular/material/divider";
import {ApplicationService} from "../../services/application.service";

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
  applicationService: ApplicationService = inject(ApplicationService);

  ngOnInit(): void {
    this.applicationService.symbols().subscribe({
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
