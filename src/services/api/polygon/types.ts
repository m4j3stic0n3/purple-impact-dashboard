export interface PolygonQuoteResponse {
  price: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export interface RateLimiter {
  callsQueue: number[];
  requestQueue: (() => Promise<any>)[];
  isProcessingQueue: boolean;
}