import {Component, OnInit} from '@angular/core';
import {IntradayChartComponent} from "../intraday-chart/intraday-chart.component";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [IntradayChartComponent, NgForOf],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {

  symbols: string[] = ['AAPL', 'GOOG', 'IBM', 'PDFS'] //
  ngOnInit(): void {

  }
}
