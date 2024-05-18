import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserPreferenceService {

  symbolBehaviorSubject: BehaviorSubject<Set<string>> = new BehaviorSubject<Set<string>>(new Set<string>());

  constructor() {
    console.log("constructor is initiated")
  }

  symbols(): Observable<Set<string>> {
    return this.symbolBehaviorSubject.asObservable();
  }

  addSymbol(symbols: string[]) {
    const symbolSet = this.symbolBehaviorSubject.getValue();
    symbols.forEach(symbol => {
      symbolSet.add(symbol);
    })
    this.symbolBehaviorSubject.next(symbolSet);
  }
}
