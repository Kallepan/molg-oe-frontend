import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { interval, Observable, Subscription } from 'rxjs';
import { CONSTANTS } from '../config/constants';
import { ERRORS } from '../config/errors.module';
import { MessageService } from '../services/message.service';

const TOKEN_API_ENDPOINT = `${CONSTANTS.AUTH_API_ENDPOINT}/token/`
const REFRESH_API_ENDPOINT = `${CONSTANTS.AUTH_API_ENDPOINT}/token/refresh/`
const REGISTER_API_ENDPOINT = `${CONSTANTS.AUTH_API_ENDPOINT}/token/register/`

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loginSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    private router: Router) { }

  private _createUser(username: string, password: string, first_name: string, last_name: string, email: string): Observable<HttpResponse<any>> {
    let data = {
      username: username,
      password: password,
      first_name: first_name,
      last_name: last_name,
      email: email,
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as const
    }

    return this.http.post(
      REGISTER_API_ENDPOINT,
      data,
      httpOptions);
  }

  register(username: string, password: string, first_name: string, last_name: string, email: string, dialogRef: any) {
    this._createUser(username, password, first_name, last_name, email).subscribe({
      error: (err) => {
        this.messageService.simpleWarnMessage(ERRORS.ERROR_API);
      }, next: (resp) => {
        this.messageService.goodMessage("Nutzer angelegt... Login kann nun erfolgen...");
        dialogRef?.close();
      }
    });
  }

  private _fetchToken(username: string, password: string): Observable<HttpResponse<any>> {
    const query_params = {
      username: username,
      password: password,
    };

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as const
    };

    return this.http.post(
      TOKEN_API_ENDPOINT,
      query_params,
      httpOptions);
  }

  login(username: string, password: string, dialogRef: any) {
    this._fetchToken(username, password).subscribe({
      error: (err) => {
        this.messageService.simpleWarnMessage(ERRORS.ERROR_API);
      }, next: (resp) => {
        const expiresAt = Date.now() + CONSTANTS.TOKEN_EXPIRY_TIME;
        localStorage.setItem(CONSTANTS.JWT_ACCESS_TOKEN_STORAGE, resp.body.access);
        localStorage.setItem(CONSTANTS.JWT_REFRESH_TOKEN_STORAGE, resp.body.refresh);
        localStorage.setItem(CONSTANTS.JWT_EXPIRES_STORAGE, JSON.stringify(expiresAt.valueOf()));
    
        localStorage.setItem(CONSTANTS.JWT_USERNAME_STORAGE, username);
        this.setupLoginChecker();
        this.messageService.goodMessage("Login erfolgreich.");
        dialogRef?.close();
      }
    });
  }

  private _renewToken() {
    const refreshToken = localStorage.getItem(CONSTANTS.JWT_REFRESH_TOKEN_STORAGE);
    if (!refreshToken) return;
    this._refreshTokenRequest(refreshToken).subscribe({
      next: (resp) => {
        const expiresAt = Date.now() + CONSTANTS.TOKEN_EXPIRY_TIME;
        localStorage.setItem(CONSTANTS.JWT_ACCESS_TOKEN_STORAGE, resp.body.access);
        localStorage.setItem(CONSTANTS.JWT_EXPIRES_STORAGE, JSON.stringify(expiresAt.valueOf()));
        this.messageService.goodMessage(`Loginzeit um ${CONSTANTS.TOKEN_EXPIRY_TIME/60/1000/60} h verlängert.`);
      }, error: (err) => {
        this.logout();
      }
    })
  }

  private _refreshTokenRequest(refreshToken: string): Observable<HttpResponse<any>> {
    // Dummy function. Does not do anything right now
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as const,
    };

    return this.http.post(REFRESH_API_ENDPOINT, {
      refresh: refreshToken
    }, httpOptions);
  }

  isLoggedIn() {
    if (!localStorage.getItem(CONSTANTS.JWT_EXPIRES_STORAGE)) {
      return false;
    }
    if (!localStorage.getItem(CONSTANTS.JWT_ACCESS_TOKEN_STORAGE)) {
      return false;
    }
    if (Date.now() > this._getExpiration()) {
      return false;
    }

    return true;
  }

  checkLoginWithDisplayMessage(errorMessage: string = ERRORS.ERROR_LOGIN): boolean {
    /*
      Returns true if logged in else false
    */
    if (this.isLoggedIn()) {
      return true;
    }

    this.messageService.simpleWarnMessage(errorMessage);
    return false;
  }

  setupLoginChecker() {
    if(!this.isLoggedIn()) return;

    this.loginSubscription = interval(CONSTANTS.CHECK_LOGIN_TIME).subscribe({
      next: () => {
        if ((this._getExpiration() - Date.now()) < CONSTANTS.EXPIRE_WARN_TIME) {
          if (confirm("Sie werden bald ausgeloggt. Login verlaengern?")) {
            this._renewToken();
          }
          else {
            this.logout()
          }
        }
      }
    });
  }

  logout() {
    localStorage.removeItem(CONSTANTS.JWT_ACCESS_TOKEN_STORAGE);
    localStorage.removeItem(CONSTANTS.JWT_REFRESH_TOKEN_STORAGE)
    localStorage.removeItem(CONSTANTS.JWT_EXPIRES_STORAGE);
    this.router.navigate(['/']);
    this.loginSubscription.unsubscribe();
    alert("Sie wurden ausgeloggt.");
  }

  private _getExpiration(): number {
    const expiration = localStorage.getItem(CONSTANTS.JWT_EXPIRES_STORAGE);
    const expiresAt = expiration ? JSON.parse(expiration) : 0;

    return expiresAt;
  }

}
