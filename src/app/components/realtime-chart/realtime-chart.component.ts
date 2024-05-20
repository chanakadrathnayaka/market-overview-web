import {Component, inject, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {HighchartsChartModule} from "highcharts-angular";
import {
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from "@angular/material/expansion";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {SymbolService} from "../../services/symbol.service";
import * as Highstock from "highcharts/highstock";
import {HighchartsData} from "../../models/HighchartData";
import {TradesService} from "../../services/trades.service";
import {TradeResponse} from "../../models/TradeResponse";

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
export class RealtimeChartComponent implements OnChanges, OnDestroy {

  @Input() symbol: string | null = null;
  symbolService: SymbolService = inject(SymbolService);
  tradeService: TradesService = inject(TradesService);
  isLoading: boolean = false;
  error: string | null = null;
  chart: Highstock.StockChart | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    let changeSymbol = changes['symbol'];
    if (this.symbol && changeSymbol && changeSymbol.currentValue !== changeSymbol.previousValue) {
      this.symbolService.getIntraday(this.symbol, '1min')
      .subscribe({
        next: (highChartData: HighchartsData) => {
          this.isLoading = false;
          this.setupChart(highChartData);
          this.connectRealtimeData();
        },
        error: error => {
          this.isLoading = false;
          this.error = error.error.message || error.error.Information || error.message;
        }
      });
    }
  }

  setupChart(highChartData: HighchartsData) {
    this.chart = new Highstock.StockChart(
      {
        chart: {
          renderTo: 'container',
          backgroundColor: '#484848'
        },
        time: {
          useUTC: false,
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
          overscroll: 2000,
          range: 60000,
          type: 'datetime',
          labels: {
            style: {
              color: '#efefef'
            }
          },
        },
        yAxis: {
          labels: {
            style: {
              color: '#efefef'
            },
            formatter: function () {
              return (+this.value).toFixed(4);
            }
          },
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
            type: 'all',
            count: 1,
            text: 'All'
          }],
          selected: 0, //1m
          inputEnabled: false
        },

        series: [{
          type: 'area',
          id: `${this.symbol}-price`,
          name: `${this.symbol}`,
          pointStart: Date.now() - 60000,
          pointInterval: 1000,
          gapSize: 5,
          tooltip: {
            valueDecimals: 4
          },
          lastPrice: {
            enabled: true,
            label: {
              enabled: true,
            }
          },

          threshold: null,
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, '#E91E63'],
              [1, '#E91E6300']
            ]
          },
          data: (function () {
            // Helps to maintain the consistency, Can be removed if realtime data is available
            const d = highChartData.ohlc;
            const l = highChartData.ohlc.length;
            let t = Date.now();
            for (let i = l - 1; i >= 0; i--) {
              d[i][0] = t;
              t -= 1000;
            }
            return d;
          }())
        }]
      });
  }

  ngOnDestroy(): void {
    this.tradeService.close()
  }

  private updateChart(point: TradeResponse | null) {
    if (point && point.s === this.symbol && this.chart) {
      const series = this.chart.series[0];
      // @ts-ignore `data` is available in `options` object
      const currentData = series.options.data;
      const t = Math.floor(point.t / 1000) * 1000;
      if (!currentData || currentData.length == 0) {
        series.setData([t, point.p]);
      } else if (currentData && currentData[currentData.length - 1][0] === t) {
        currentData[currentData.length - 1] = [t, point.p];
        series.setData(currentData);
      } else {
        series.addPoint([t, point.p]);
      }
    }
  }

  private connectRealtimeData() {
    if (this.symbol) {
      this.tradeService.connect(this.symbol).subscribe({
        next: (data) => {
          this.updateChart(data)
        },
        error: err => {
          console.error(err);
        },
        complete: () => {
          console.log('Completed')
        }
      });
    }
  }
}
