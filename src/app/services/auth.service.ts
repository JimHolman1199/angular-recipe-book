import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, BehaviorSubject } from 'rxjs';

export interface AuthResponseData {
    kind:string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?:boolean
}

@Injectable({providedIn:'root'})
export class AuthService {
    user = new BehaviorSubject<User>(null);
    private tokenExpirationDuration: any;

    constructor( private http: HttpClient,
                 private router: Router ){}

    signUp(email: string, password: string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDxZxqqvGYHznIJLT3uUCa2w23uxj5O2YA'
            , {
                email,
                password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError), tap(resData=>{
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }))
    }

    login(email:string, password:string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDxZxqqvGYHznIJLT3uUCa2w23uxj5O2YA'
        ,{
            email,
            password,
            returnSecureToken: true
        }).pipe(catchError(this.handleError), tap(resData=>{
            this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn)
        }))
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData')
        if(this.tokenExpirationDuration){
            clearTimeout(this.tokenExpirationDuration);
        }
    }

    autoLogout(exp: number){
        this.tokenExpirationDuration = setTimeout(() => {
            this.logout();
        }, exp);
    }

    autoLogin(){
        const userData :{
            email: string;
            id:string;
            _token:string;
            _tokenExpirationDate: string;
        }= JSON.parse(localStorage.getItem('userData'));
        if(!userData){
            return
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate))

        if(loadedUser.token){
            this.user.next(loadedUser);
            const exp = new Date(userData._tokenExpirationDate).getTime()- new Date().getTime()
            this.autoLogout(exp)
        }
    }

    private handleAuthentication(email:string, userId:string, token:string, expiresIn:number){
        const expDate = new Date(new Date().getTime()+ +expiresIn * 1000)
        const user = new User(email, userId, token, expDate)
        this.user.next(user);
        this.autoLogout(expiresIn * 1000)
        localStorage.setItem('userData', JSON.stringify(user))
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = 'An unknown error occured!'

        if(!errorRes.error || !errorRes.error.error){
            return throwError(errorMessage)
        }
        switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
                errorMessage = 'This email alredy exist'
                break;
            case 'EMAIL_NOT_FOUND':
                errorMessage = 'This email does not exist'
                break;
            case 'INVALID_PASSWORD':
                errorMessage = 'This password is not correct'
                break;
        }

        return throwError(errorMessage);
    }

}