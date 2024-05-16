import {Observable} from "rxjs";
import {IntradayResponse, IntradayVariance} from "../models/IntradayResponse";
import {HighchartsData} from "../models/HighchartData";
import {parse} from "date-fns";

export const filterResponse = (intradayVariance: IntradayVariance) => (source: Observable<IntradayResponse>) =>
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
