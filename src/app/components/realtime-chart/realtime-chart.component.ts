import {Component, inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
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
export class RealtimeChartComponent implements OnInit, OnChanges, OnDestroy {

  @Input() symbol: string | null = null;
  symbolService: SymbolService = inject(SymbolService);
  HighchartsInstance: typeof Highcharts = Highstock;
  hasChartUpdated: boolean = false;
  isLoading: boolean = true;
  error: string | null = null;
  chartOptions: Highcharts.Options = {
    title: {
      style: {
        color: '#efefef'
      }
    },
    colors: ['#E91E63', '#3F51B5', '#F44336',
      '#9C27B0', '#24CBE5', '#64E572', '#FF9655',
      '#FFF263', '#6AF9C4'],
    chart: {
      backgroundColor: '#262626',
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
        type: 'minute',
        count: 60,
        text: '60m'
      }, {
        type: 'all',
        text: 'All'
      }],
      inputEnabled: false,
      selected: 6
    },
    yAxis: [
      {
        labels: {
          align: "left",
          style: {
            color: '#efefef'
          }
        },
        height: "80%",
        resize: {
          enabled: true
        }
      },
      {
        labels: {
          align: "left",
          style: {
            color: '#efefef'
          }
        },
        top: "80%",
        height: "20%",
        offset: 0
      }
    ],
    xAxis: [
      {
        labels: {
          style: {
            color: '#efefef'
          }
        },
      },
      {
        labels: {
          style: {
            color: '#efefef'
          }
        },
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
        type: "area",
        data: []
      },
      {
        type: "column",
        data: [],
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
  timerId: number = -1;

  ngOnInit(): void {
    this.timerId = setInterval(() => {
      const dummy: TradeResponse = {
        p: Math.random() * (200 - 160) + 160,
        s: this.symbol!,
        v: Math.random() * (100 - 1) + 1,
        t: new Date().getTime()
      }
      this.addDataPoints(dummy);
    }, 1000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes['symbol'].currentValue);
    this.isLoading = true;

    this.symbol && this.symbolService.getIntraday(this.symbol, '1min')
    .subscribe({
      next: (highChartData: HighchartsData) => {
        this.isLoading = false;
        this.initializeChart(highChartData);
      },
      error: err => {
        this.isLoading = false;
        this.error = err.error;
      }
    });
  }

  initializeChart(highChartData: HighchartsData): void {

    this.chartOptions.title!.text = `${this.symbol} Stock Price`;
    this.chartOptions.series = [
      {
        type: 'area',
        id: `${this.symbol}-intraday`,
        name: `${this.symbol} Stock Price`,
        data: highChartData.ohlc,
        gapSize: 5,
        tooltip: {
          valueDecimals: 2
        },
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
        threshold: null
      },
      {
        type: "column",
        id: `${this.symbol}-volume`,
        name: `${this.symbol} Volume`,
        data: highChartData.volume,
        yAxis: 1
      }
    ];
    this.hasChartUpdated = true;
  }

  addDataPoints(data: TradeResponse) {
    const priceDataPoint = [data.t, data.p];
    const volumeDataPoint = [data.t, data.v];

    console.log('Updating', priceDataPoint, volumeDataPoint)
    // @ts-ignore
    this.chartOptions.series[0].data.push(priceDataPoint);
    // @ts-ignore
    this.chartOptions.series[1].data.push(volumeDataPoint);
    this.hasChartUpdated = true;
  }

  ngOnDestroy(): void {
    clearInterval(this.timerId);
  }
}
