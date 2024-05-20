import {inject, Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {environment} from "../../environment";
import {HttpClient} from "@angular/common/http";
import {ExchangeResponse} from "../models/ExchangeResponse";

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {

  private readonly httpClient: HttpClient = inject(HttpClient);

  status(market: string): Observable<ExchangeResponse> {
    return this.httpClient.get<ExchangeResponse>(`${environment.apiHost}/exchange/status/${market}`)
  }
}
