import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, CanLoad, Route } from '@angular/router';
import { IdentityService } from './identity.service';

@Injectable()
export class LoginGuardService implements CanActivate {
    token;
    tokenDecode;

    constructor(private identityService: IdentityService, public router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.token = localStorage.getItem('access_token');
        if ((!this.token) || (this.token && this.identityService.isTokenExpired(this.token)))
        {
            return true;
        }
        this.router.navigate(['/dashboard']);
        return false;
    }
}