import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environment";
import {IntradayResponse, IntradayVariance} from "../models/IntradayResponse";
import {Observable} from "rxjs";
import {IntradayInterval} from "../models/Types";
import {HighchartsData} from "../models/HighchartData";
import {filterResponse} from "./service.utils";
import {SearchResponse} from "../models/SearchResponse";

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
    .pipe(filterResponse(this.intradayMap.get(interval)!));
  }

  search(symbol: string): Observable<SearchResponse> {
    return this.httpClient.get<SearchResponse>(`${environment.apiHost}/symbol/search?symbol=${symbol}`)
  }
}
