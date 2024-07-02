import { CartComponent } from './../pages/cart/cart.component';
import { CartService } from './cart.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(this.getUserDetails())
  user$: Observable<any> = this.userSubject.asObservable() 
  api: string = 'http://localhost:3000'
  constructor(private http: HttpClient, private cookieService: CookieService, private router: Router) { }

  register(formData: any) {
    return this.http.post<any>(`${this.api}/auth/register`, formData)
  }
  confirmEmail(formData: any) {
    return this.http.post<any>(`${this.api}/auth/activate-account`, formData)
  }
  login(formData: any) {
    return this.http.post<any>(`${this.api}/auth/login`, formData)
  }
  

  public setSession(authResult: any): void {
    const expiresIn = authResult.data.expiresIn; // assuming expiresIn is in seconds
    const expirationDate = new Date(new Date().getTime() + expiresIn);
    this.cookieService.set('access_token', authResult.data.token, expirationDate, '/');
    this.cookieService.set('refresh_token', authResult.data.refreshToken, new Date(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000)), '/');// 7 days
    this.cookieService.set('user', authResult.data.user.id, new Date(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000)))
    this.cookieService.set('role', authResult.data.user.role, new Date(expirationDate.getTime() + (7 * 24 * 60 * 60 * 1000)))
  }

  refreshToken(): Subscription {
    const refreshToken = this.cookieService.get('refresh_token');
    return this.http.post<any>(`${this.api}/auth/refresh-token`, { token: refreshToken }).subscribe({
      next: (res) => {
        this.setSession(res)
      },
      error: (err) => {
        console.log(err)
      }
    })
      
  }

  logout(): void {
    this.cookieService.delete('access_token', '/');
    this.cookieService.delete('refresh_token', '/');
    this.cookieService.delete('user', '/');
    this.cookieService.delete('role', '/');
    
   
    

  }

  getToken(): string {
    
    return this.cookieService.get('access_token');
    
  }
  checkToken(): Boolean {
    return this.cookieService.check('access_token')
  }
  getuser(): string {
    return this.cookieService.get('user')
  }
  getRefreshToken(): string {
   
    return this.cookieService.get('refresh_token');
  }
  getUserDetails() {
    return this.http.get<any>(`${this.api}/auth/user`).subscribe({
      next: (res) => {
        this.userSubject.next(res.data)
      },
      error: (err) => {
        console.log(err)
      },
    })
  }
  sendforgot(value: any) {
    return this.http.post<any>(`${this.api}/auth/forgot-password`, value)
  }
  sendforgotcode(value: any) {
    return this.http.post<any>(`${this.api}/auth/verifycode`, value)
  }
  resetPassword(value:any) {
    return this.http.post<any>(`${this.api}/auth/reset-password`, value)
  }
}
