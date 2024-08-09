import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoadingBarService } from '@ngx-loading-bar/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private cache = new Map<string, any>();

  constructor(
    private http: HttpClient,
    private loadingBar: LoadingBarService
  ) {}

  getUsers(page: number): Observable<any> {
    const url = `https://reqres.in/api/users?page=${page}`;
    if (this.cache.has(url)) {
      return of(this.cache.get(url));
    } else {
      this.loadingBar.start();
      return this.http.get(url).pipe(
        map((response) => {
          this.cache.set(url, response);
          this.loadingBar.complete();
          return response;
        }),
        catchError((error) => {
          console.error('Error fetching users', error);
          this.loadingBar.complete();
          return of(null);
        })
      );
    }
  }

  getUser(id: number): Observable<any> {
    const url = `https://reqres.in/api/users/${id}`;
    if (this.cache.has(url)) {
      return of(this.cache.get(url));
    } else {
      return this.http.get(url).pipe(
        map((response) => {
          this.cache.set(url, response);
          return response;
        }),
        catchError((error) => {
          console.error('Error fetching user', error);
          return of(null);
        })
      );
    }
  }
}
