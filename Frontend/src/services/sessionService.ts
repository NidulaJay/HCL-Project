import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from './userService';
@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private userService: UserService) { }

  public  user?: User ;

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof sessionStorage !== 'undefined';
  }

  saveToSession(user: User): void{
    if(this.isBrowser()){
      sessionStorage.setItem('user', JSON.stringify(user));
      console.log('user saved to session');
    }
  }

  getCurrentUser(): any {
    if (this.isBrowser()) {
      const res = sessionStorage.getItem('user');
      if (res !== null && res !== undefined) {
        const parsedUser = JSON.parse(res);
        return this.userService.mapToModel(parsedUser);
      }else{
        return null
      }
    }
    return null;
  }

  removeCurrentUser(): any {
    if(this.getCurrentUser()){
      sessionStorage.removeItem('user');
    }
  }

}