import {Component, inject, Input, OnInit} from '@angular/core';
import {HighchartsChartModule} from "highcharts-angular";
import {SymbolService} from "../../services/symbol.service";
import {NgIf} from "@angular/common";

import Highcharts from 'highcharts';
import * as Highstock from "highcharts/highstock";
import {HighchartsData} from "../../models/HighchartData";

@Component({
  selector: 'app-intraday-chart',
  standalone: true,
  imports: [HighchartsChartModule, NgIf],
  templateUrl: './intraday-chart.component.html',
  styleUrl: './intraday-chart.component.css'
})
export class IntradayChartComponent implements OnInit {

  @Input() symbol: string | null = null;
  @Input() index: number = 0;
  symbolService: SymbolService = inject(SymbolService);
  HighchartsInstance: typeof Highcharts = Highstock;
  chartOptions: Highcharts.Options = {
    yAxis: [
      {
        labels: {
          align: "left"
        },
        height: "80%",
        resize: {
          enabled: true
        }
      },
      {
        labels: {
          align: "left"
        },
        top: "80%",
        height: "20%",
        offset: 0
      }
    ],
    tooltip: {
      headerShape: "callout",
      borderWidth: 0,
      shadow: false,
      positioner: function (width, height, point) {
        let chart = this.chart;
        let position;
        if (point.isHeader) {
          position = {
            x: Math.max(
                // Left side limit
                chart.plotLeft,
                Math.min(
                    point.plotX + chart.plotLeft - width / 2,
                    // Right side limit
                    // @ts-ignore
                    chart.chartWidth - width - chart.marginRight
                )
            ),
            y: point.plotY
          };
        } else {

          position = {
            x: point.series.chart.plotLeft,
            // @ts-ignore
            y: point.series.yAxis.top - chart.plotTop
          };
        }

        return position;
      }
    },
    series: [
      {
        type: "ohlc",
        data: []
      },
      {
        type: "column",
        data: [],
        yAxis: 1
      }
    ],
    responsive: {
      rules: [
        {
          condition: {
            maxWidth: 800
          },
          chartOptions: {
            rangeSelector: {
              inputEnabled: false
            }
          }
        }
      ]
    }
  };

  ngOnInit(): void {
    this.symbol && this.symbolService.getIntraday(this.symbol, '5min', "full").subscribe((highChartData: HighchartsData) => {
      this.setChartData(highChartData);
    });
  };

  setChartData(highChartData: HighchartsData): void {
    this.HighchartsInstance.charts[this.index]?.title.update({text: `${this.symbol} Stock Price`});
    const ohlcSeries = this.HighchartsInstance.charts[this.index]?.series![0];
    const volumeSeries = this.HighchartsInstance.charts[this.index]?.series![1];

    ohlcSeries?.update({
      type: "ohlc",
      id: `${this.symbol}-ohlc`,
      name: `${this.symbol} Stock Price`,
      data: highChartData.ohlc
    });
    volumeSeries?.update({
      type: "column",
      id: `${this.symbol}-volume`,
      name: `${this.symbol} Volume`,
      data: highChartData.volume
    });
  }
}
