import {inject, Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {UserProfile} from "../models/UserProfile";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  cookieService = inject(CookieService);
  private readonly symbolBehaviorSubject: BehaviorSubject<Set<string>>;
  private readonly loggedInBehaviorSubject: BehaviorSubject<boolean>;
  private readonly userProfileBehaviorSubject: BehaviorSubject<UserProfile>;

  constructor() {
    this.loggedInBehaviorSubject = new BehaviorSubject<boolean>(this.cookieService.get('logged') === 'yes');
    const profile = localStorage.getItem('profile');
    if (!profile) {
      this.userProfileBehaviorSubject = new BehaviorSubject<UserProfile>({} as UserProfile);
      this.symbolBehaviorSubject = new BehaviorSubject<Set<string>>(new Set<string>());
    } else {
      const value: UserProfile = <UserProfile>JSON.parse(profile);
      if (value.preferences) {
        this.symbolBehaviorSubject = new BehaviorSubject<Set<string>>(new Set<string>(value.preferences));
      } else {
        this.symbolBehaviorSubject = new BehaviorSubject<Set<string>>(new Set<string>());
      }
      this.userProfileBehaviorSubject = new BehaviorSubject<UserProfile>(value);
    }
  }

  symbols(): Observable<Set<string>> {
    return this.symbolBehaviorSubject.asObservable();
  }

  symbolsValues(): Set<string> {
    return this.symbolBehaviorSubject.getValue();
  }

  addSymbol(symbols: string[]) {
    const symbolSet = this.symbolBehaviorSubject.getValue();
    symbols.forEach(symbol => {
      symbolSet.add(symbol);
    })
    this.symbolBehaviorSubject.next(symbolSet);
  }

  setLoggedIn(status: boolean) {
    if (status) {
      this.cookieService.set('logged', 'yes');
    } else {
      this.cookieService.set('logged', 'no', 0);
      localStorage.removeItem('profile');
    }
    this.loggedInBehaviorSubject.next(status);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInBehaviorSubject.asObservable();
  }

  setUserProfile(userProfile: UserProfile) {
    localStorage.setItem('profile', JSON.stringify(userProfile));
    this.userProfileBehaviorSubject.next(userProfile);
  }

  getUserProfile(): BehaviorSubject<UserProfile> {
    return this.userProfileBehaviorSubject;
  }
}
