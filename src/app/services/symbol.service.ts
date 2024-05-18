import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environment";
import {IntradayResponse, IntradayVariance} from "../models/IntradayResponse";
import {Observable} from "rxjs";
import {IntradayInterval} from "../models/Types";
import {HighchartsData} from "../models/HighchartData";
import {SearchResponse} from "../models/SearchResponse";
import {parse} from "date-fns";

@Injectable({
  providedIn: 'root'
})
export class SymbolService {
  private readonly httpClient: HttpClient = inject(HttpClient);
  private readonly intradayMap: Map<IntradayInterval, IntradayVariance> = new Map<IntradayInterval, IntradayVariance>();

  constructor() {
    this.intradayMap.set('1min', IntradayVariance.ONE_MIN)
    this.intradayMap.set('5min', IntradayVariance.FIVE_MIN)
    this.intradayMap.set('15min', IntradayVariance.FIFTEEN_MIN)
    this.intradayMap.set('30min', IntradayVariance.THIRTY_MIN)
    this.intradayMap.set('60min', IntradayVariance.SIXTY_MIN)
  }

  getIntraday(symbol: string, interval: IntradayInterval, outputSize?: 'full' | 'compact'): Observable<HighchartsData> {
    return this.httpClient
    .get<IntradayResponse>(`${environment.apiHost}/symbol/intraday/${symbol}?interval=${interval}${outputSize ? `&size=${outputSize}` : ''}`)
    .pipe(this.filterResponse(this.intradayMap.get(interval)!));
  }

  search(symbol: string): Observable<SearchResponse> {
    return this.httpClient.get<SearchResponse>(`${environment.apiHost}/symbol/search?symbol=${symbol}`)
  }

  quote(symbol: string): Observable<SearchResponse> {
    return this.httpClient.get<SearchResponse>(`${environment.apiHost}/symbol/quotes/${symbol}`)
  }

  private filterResponse(intradayVariance: IntradayVariance): (source: Observable<IntradayResponse>) => Observable<HighchartsData> {
    return (source: Observable<IntradayResponse>) =>
      new Observable<HighchartsData>(observer => {

        return source.subscribe({
          next(r: IntradayResponse) {
            const data = r[intradayVariance];
            const ohlcSeries: number[][] = [];
            const volumeSeries: number[][] = [];

            for (const ts in data) {
              const time = parse(ts, 'yyyy-MM-dd HH:mm:ss', new Date()).getTime();
              const dataPoint = data[ts];
              const ohlc: number[] = [time];
              const volume: number[] = [time];
              Object.values(dataPoint).forEach((v, i) => {
                if (i === 4)
                  volume.push(+v);
                else
                  ohlc.push(+v);
              });
              ohlcSeries.push(ohlc);
              volumeSeries.push(volume);
            }

            observer.next({ohlc: ohlcSeries.reverse(), volume: volumeSeries.reverse()});
          },
          error(err) {
            observer.error(err);
          },
          complete() {
            observer.complete();
          }
        });
      });
  }
}
