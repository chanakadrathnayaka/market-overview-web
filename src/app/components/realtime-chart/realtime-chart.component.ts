import {Component, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {HighchartsChartModule} from "highcharts-angular";
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SymbolService} from "../../services/symbol.service";
import Highcharts from "highcharts";
import * as Highstock from "highcharts/highstock";
import {HighchartsData} from "../../models/HighchartData";

@Component({
  selector: 'app-realtime-chart',
  standalone: true,
  imports: [
    HighchartsChartModule,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatProgressSpinner
  ],
  templateUrl: './realtime-chart.component.html',
  styleUrl: './realtime-chart.component.css'
})
export class RealtimeChartComponent implements OnChanges {

  @Input() symbol: string | null = null;
  symbolService: SymbolService = inject(SymbolService);
  isLoading: boolean = false;
  error: string | null = null;
  timerId: number = -1;

  ngOnChanges(changes: SimpleChanges): void {
    let changeSymbol = changes['symbol'];
    if (changeSymbol !== null && changeSymbol.currentValue !== changeSymbol.previousValue) {
      this.symbol && this.symbolService.getIntraday(this.symbol, '1min')
      .subscribe({
        next: (highChartData: HighchartsData) => {
          this.isLoading = false;
          this.setupChart(highChartData);
        },
        error: err => {
          this.isLoading = false;
          this.error = err.error;
        }
      });
    }
  }

  setupChart(highChartData: HighchartsData) {
    const chart = new Highstock.StockChart(
      {
        chart: {
          renderTo: 'container',
          backgroundColor: '#484848',
          events: {
            load() {
              const chart = this,
                series = chart.series[0];
// Imitate getting point from backend
              // @ts-ignore
              function getNewPoint(i, data) {
                const lastPoint = data[data.length - 1];

                // Add new point
                if (i === 0 || i % 10 === 0) {
                  return [
                    lastPoint[0] + 60000,
                    lastPoint[4],
                    lastPoint[4],
                    lastPoint[4],
                    lastPoint[4]
                  ];
                }
                const updatedLastPoint = data[data.length - 1],
                  newClose = Highcharts.correctFloat(
                    lastPoint[4] + Highcharts.correctFloat(Math.random() - 0.5, 2),
                    4
                  );

                // Modify last data point
                return [
                  updatedLastPoint[0],
                  data[data.length - 2][4],
                  newClose >= updatedLastPoint[2] ? newClose : updatedLastPoint[2],
                  newClose <= updatedLastPoint[3] ? newClose : updatedLastPoint[3],
                  newClose
                ];
              }

              let i = 0;

              setInterval(() => {
                if (series.options) { // @ts-ignore
                  const data = series.options.data,
                    newPoint = getNewPoint(i, data),
                    lastPoint = data[data.length - 1];

                  if (lastPoint[0] !== newPoint[0]) {
                    series.addPoint(newPoint);
                  } else {
                    // @ts-ignore
                    series.options.data[data.length - 1] = newPoint;

                    series.setData(data);
                  }
                  i++;
                }
              }, 100);
            }
          }
        },

        title: {
          text: `${this.symbol} Stock Price`,
          style: {
            color: '#efefef'
          }
        },
        colors: ['#E91E63', '#3F51B5', '#F44336',
          '#9C27B0', '#24CBE5', '#64E572', '#FF9655',
          '#FFF263', '#6AF9C4'],
        xAxis: {
          overscroll: 50000,
          range: 4 * 200000,
          gridLineWidth: 1,
          labels: {
            style: {
              color: '#efefef'
            }
          }
        },
        yAxis: {
          labels: {
            style: {
              color: '#efefef'
            }
          }
        },

        rangeSelector: {
          buttons: [{
            type: 'minute',
            count: 1,
            text: '1m'
          }, {
            type: 'minute',
            count: 5,
            text: '5m'
          }, {
            type: 'minute',
            count: 15,
            text: '15m'
          }, {
            type: 'minute',
            count: 30,
            text: '30m'
          }, {
            type: 'hour',
            count: 1,
            text: '1h'
          }, {
            type: 'all',
            count: 1,
            text: 'All'
          }],
          selected: 4, //1h
          inputEnabled: false
        },

        navigator: {
          series: {
            color: '#000000'
          }
        },

        series: [{
          type: 'candlestick',
          id: `${this.symbol}-price`,
          name: `${this.symbol}`,
          // color: '#FF7F7F',
          // upColor: '#90EE90',
          lastPrice: {
            enabled: true,
            label: {
              enabled: true,
              // backgroundColor: '#FF7F7F'
            }
          },
          data: highChartData.ohlc
        }]


      });
  }
}
