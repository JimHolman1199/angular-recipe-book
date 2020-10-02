import { catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

export interface AuthResponseData {
    kind:string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string
}

@Injectable({providedIn:'root'})
export class AuthService {

    constructor( private http: HttpClient ){}

    signUp(email: string, password: string){
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDxZxqqvGYHznIJLT3uUCa2w23uxj5O2YA'
            , {
                email,
                password,
                returnSecureToken: true
            }
        ).pipe(catchError( err => {
            let errorMessage = 'An unknown error occured!'

            if(!err.error || !err.error.error){
                return throwError(errorMessage)
            }
            switch (err.error.error.message) {
                case 'EMAIL_EXISTS':
                    errorMessage = 'This email alredy exist'
                  break;
            }
            return throwError(errorMessage);
        })
        )
    }
}