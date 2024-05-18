import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../environment";
import {UserProfile} from "../models/UserProfile";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly httpClient: HttpClient = inject(HttpClient);

  login(email: string, password: string): Observable<UserProfile> {
    return this.httpClient.post<UserProfile>(`${environment.apiHost}/user/login`, {
      email, password
    });
  }

  register(email: string, password: string, firstName: string, lastName: string): Observable<UserProfile> {
    return this.httpClient.post<UserProfile>(`${environment.apiHost}/user/profile`, {
      email, password, firstName, lastName
    });
  }

  update(profile: {
    email?: string,
    password?: string,
    firstName?: string,
    lastName?: string,
    preferences?: string[]
  }): Observable<UserProfile> {

    return this.httpClient.put<UserProfile>(`${environment.apiHost}/user/profile`, {
      ...profile
    });
  }
}
