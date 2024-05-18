import {SearchResult} from "./SearchResult";

export interface SearchResponse {
  count: number;
  result: SearchResult[]
}
