import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({providedIn:'root'})
export class AuthGuard implements CanActivate{

    constructor( private authService: AuthService,
                 private router: Router ){}

    canActivate( route:ActivatedRouteSnapshot, router: RouterStateSnapshot ): boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
        return this.authService.user.pipe(take(1),map(user=>{
            const isAuth = !!user;
            return isAuth ? true : this.router.createUrlTree(['/auth'])
        }));
    } 
}
