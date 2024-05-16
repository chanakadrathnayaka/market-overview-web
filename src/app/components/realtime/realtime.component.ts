import {Component} from '@angular/core';
import {MatListModule} from "@angular/material/list";
import {MatGridListModule} from "@angular/material/grid-list";
import {RealtimeChartComponent} from "../realtime-chart/realtime-chart.component";

@Component({
  selector: 'app-realtime',
  standalone: true,
  imports: [MatListModule, MatGridListModule, RealtimeChartComponent],
  templateUrl: './realtime.component.html',
  styleUrl: './realtime.component.css'
})
export class RealtimeComponent {

  symbols: string[] = ['AAPL', 'GOOG', 'IBM', 'PDFS', 'AMZN', 'META', 'TSLA'] //
  selectedSymbol: string | null = this.symbols[0];

  show(symbol: string) {
    this.selectedSymbol = symbol;
  }

}
