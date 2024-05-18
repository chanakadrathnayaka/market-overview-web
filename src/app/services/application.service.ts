import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private readonly symbolBehaviorSubject: BehaviorSubject<Set<string>> = new BehaviorSubject<Set<string>>(new Set<string>());
  private readonly loggedInBehaviorSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    this.symbolBehaviorSubject.next(new Set<string>(['AAPL', 'GOOG', 'IBM', 'PDFS']));
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

  isLoggedIn(): Observable<boolean> {
    return this.loggedInBehaviorSubject.asObservable();
  }

  setLoggedIn(loggedIn: boolean) {
    this.loggedInBehaviorSubject.next(loggedIn);
  }
}
