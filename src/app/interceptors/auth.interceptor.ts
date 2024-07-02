import { AuthService } from './../Services/auth.service';
import { inject, Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpInterceptorFn, HttpHandlerFn } from '@angular/common/http';
import { catchError, Observable, switchMap, throwError } from 'rxjs';
import { Router } from '@angular/router';



export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
    console.log('interceptor');

    // List of URLs to intercept
    const urlsToIntercept = [
        '/products/delete',
        '/cart',
        '/auth/user',
        '/getfav',
        '/addtofav',
        'removefav'


    ];
    const router = inject(Router)
    const authService = inject(AuthService)
    // Check if the URL matches any in the list
    const shouldIntercept = urlsToIntercept.some(url => req.url.includes(url));

    if (shouldIntercept) {
        console.log('interceptor2');
        const refresh_token = authService.getRefreshToken()
        const token = authService.getToken();
        console.log(token.length);
        if (token.length > 0) {
            console.log('option 1');

            req = req.clone({
                setHeaders: {
                    Authorization: `${token}`
                }
            });
            
            return next(req)
        }
        else if (refresh_token.length > 0) {
            console.log('refresh');
            const refresh = authService.refreshToken()
            console.log(refresh)


            const newToken = authService.getToken()
            req = req.clone({
                setHeaders: {
                    Authorization: `${newToken}`
                }
            });
            console.log(req);

            return next(req);




        }
        else {
            const error = {
                error: true,
                message: 'please login to continue'
            }
            router.navigate(['/auth'])
            
        }
    }

    return next(req)

}

