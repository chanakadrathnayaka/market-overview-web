export enum IntradayVariance {
  ONE_MIN = "Time Series (1min)",
  FIVE_MIN = "Time Series (5min)",
  FIFTEEN_MIN = "Time Series (15min)",
  THIRTY_MIN = "Time Series (30min)",
  SIXTY_MIN = "Time Series (60min)",
}

export interface IntradayResponse {
  "Meta Data": { [key: string]: string };
  [IntradayVariance.ONE_MIN]?: { [timestamp: string]: { [key: string]: string } }
  [IntradayVariance.FIVE_MIN]?: { [timestamp: string]: { [key: string]: string } }
  [IntradayVariance.FIFTEEN_MIN]?: { [timestamp: string]: { [key: string]: string } }
  [IntradayVariance.THIRTY_MIN]?: { [timestamp: string]: { [key: string]: string } }
  [IntradayVariance.SIXTY_MIN]?: { [timestamp: string]: { [key: string]: string } }
}
