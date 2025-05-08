import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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
}
