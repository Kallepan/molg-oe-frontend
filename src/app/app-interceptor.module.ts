import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from "./login/auth.service";
import { CONSTANTS, CustomError } from "./config/constants";

@Injectable()
export class GlobalInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Check if logged in
    if (!this.authService.isLoggedIn()) {
      return next.handle(req);
    }
    
    // Check if target url is auth api endpoint
    if(!req.url.includes(CONSTANTS.AUTH_API_ENDPOINT)) {
      return next.handle(req);
    }

    const JWT_ACCESS_TOKEN = localStorage.getItem(CONSTANTS.JWT_ACCESS_TOKEN_STORAGE);

    const clonedReq = req.clone({
      headers: req.headers.set("Authorization", "Bearer " + JWT_ACCESS_TOKEN)
    });

    // Send request with token
    return next.handle(clonedReq);
  }
}

@Injectable()
export class ErrorCatchingInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = '';
        if (error.error instanceof ErrorEvent) {
          errorMsg = `${error.error.message}`;
        } else if (typeof error.error === 'string') {
          errorMsg = error.error;
        } else {
          switch(error.status) {
            case 0:
              errorMsg = `Netzwerkfehler.`; 
              break;
            case 403:
              errorMsg = `Zugriff nicht erlaubt.`;
              break;
            case 404:
              errorMsg = `Resource nicht gefunden.`;
              break;
            case 500:
              errorMsg = `Datenbankfehler. Bitte den Admin kontaktieren.`;
              break;
            default:
              errorMsg = `Message: ${error.message}`;
          }
        }
        const ERR: CustomError = {
          status: error.status,
          message: errorMsg,
          error: error.error,
        };
        return throwError(() => ERR);
      }),
    );
  }
}