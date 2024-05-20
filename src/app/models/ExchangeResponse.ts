export interface ExchangeResponse {
  exchange: string;
  holiday: string | null;
  isOpen: boolean;
  session: 'pre-market' | 'post-market' | null;
}
