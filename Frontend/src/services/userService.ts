import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'http://localhost:3001/api/user';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<User> {
    const body = { username, password };

    return this.http.post<{ user: any }>(`${this.apiUrl}/login`, body).pipe(
      map((response) => {
        if (response && response.user) {
          return this.mapToModel(response.user);
        } else {
          throw new Error('Invalid login response');
        }
      })
    );
  }

  register(name: string, username: string, password: string): Observable<any> {
    const body = { name, username, password };
    return this.http.post(`${this.apiUrl}/create`, body);
  }

  mapToModel(data: any): User {
    return {
      id: data.id,
      name: data.name,
      username: data.username,
    };
  }

  createContact(Data: any): Observable<any>{
    const headers =  new HttpHeaders();
    return this.http.post("http://localhost:3001/api/Contact/create" ,Data, {headers}).pipe(catchError((error: HttpErrorResponse) =>{
      return throwError(error);
    }));
  }

  getrole(Data: any): Observable<any>{
    const headers =  new HttpHeaders();
    return this.http.post("http://localhost:3001/api/user/getRole" ,Data, {headers}).pipe(catchError((error: HttpErrorResponse) =>{
      return throwError(error);
    }));
  }

  getContact(): Observable<any> {
    return this.http.get<any[]>("http://localhost:3001/api/Contact/all").pipe(
      map(data => data.reverse()),
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );
  }

  setStatus(Data: any): Observable<any>{
    const headers =  new HttpHeaders();
    return this.http.post("http://localhost:3001/api/Contact/setStatus" ,Data, {headers}).pipe(catchError((error: HttpErrorResponse) =>{
      return throwError(error);
    }));
  }


}
