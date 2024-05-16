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
    title: {
      style: {
        color: '#efefef'
      }
    },
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
    chart: {
      backgroundColor: '#262626',
    },
    rangeSelector: {
      buttons: [{
        type: 'minute',
        count: 5,
        text: '5m'
      }, {
        type: 'minute',
        count: 30,
        text: '30m'
      }, {
        type: 'hour',
        count: 1,
        text: '1h'
      }, {
        type: 'day',
        count: 1,
        text: '1d'
      }, {
        type: 'month',
        count: 1,
        text: '1m'
      }, {
        type: 'year',
        count: 1,
        text: '1y'
      }, {
        type: 'all',
        text: 'All'
      }],
      inputEnabled: true, // it supports only days
      selected: 4 // all
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
    this.symbol && this.symbolService.getIntraday(this.symbol, '1min', "full").subscribe((highChartData: HighchartsData) => {
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
