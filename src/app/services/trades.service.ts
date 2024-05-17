import {Injectable} from '@angular/core';
import {environment} from "../../environment";
import {TradeResponse} from "../models/TradeResponse";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TradesService {

  webSocket: WebSocket | null = null;
  dataBehaviorSubject: BehaviorSubject<TradeResponse | null> = new BehaviorSubject<TradeResponse | null>(null);

  connect(symbol: string) {
    this.webSocket = new WebSocket(`${environment.wsHost}/trades`);
    this.webSocket.onmessage = (event) => {
      this.dataBehaviorSubject.next(JSON.parse(event.data));
    };
    this.webSocket.addEventListener('open', () => {
      this.send(symbol);
    })
    return this.dataBehaviorSubject.asObservable();
  }

  send(symbol: string) {
    if (this.webSocket?.readyState === WebSocket.OPEN) {
      this.webSocket?.send(symbol);
    } else {
      throw new Error('WebSocket is not opened!');
    }
  }

  close() {
    this.webSocket?.close();
  }
}
