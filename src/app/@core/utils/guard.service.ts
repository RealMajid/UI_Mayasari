import { Injectable } from '@angular/core';
import { Router, CanActivate, RouterStateSnapshot, ActivatedRouteSnapshot, CanLoad, Route } from '@angular/router';
import { IdentityService } from './identity.service';

@Injectable()
export class GuardService implements CanActivate, CanLoad {
    constructor(private identityService: IdentityService, public router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.identityService.getUserIdentity();
        if (this.identityService.token && !this.identityService.isTokenExpired(this.identityService.token))
        {
            return true;
        }   
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
        return false;
    }

    canLoad(route: Route): boolean {
        this.identityService.getUserIdentity();
        if (this.identityService.token && !this.identityService.isTokenExpired(this.identityService.token)) {
           return true; 
        }
        this.router.navigate(['/']);
            return false;		
    }
}