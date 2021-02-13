import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as CryptoJS from 'crypto-js';

@Injectable()
export class IdentityService {
    public userIdentity: any;
    public token: string;
    public tokenDecode: any;
    public authstring: string;
    // public groupId: any;
    // public parentGroupId: any;
    // public nmDept: string;
    // public nmSatker: string;
    // public kdDept: string;
    // public kdSatker: string;
    // public instrumentId: any;
    // public nmUnit: string;
    // public kdUnit: string;
    // public ud1: string;
    // public ud2: string;
    public username: string;
    public role: string;


    constructor(private router: Router, private jwtHelper: JwtHelperService) { }

    getUserIdentity(): void {
        this.token = localStorage.getItem('access_token');
        if ((!this.token) || (this.token && this.jwtHelper.isTokenExpired(this.token))) {
            this.router.navigate(['/']);
        } else {
            this.tokenDecode = this.jwtHelper.decodeToken(this.token);
            this.username = this.tokenDecode.unique_name;
            this.role = this.tokenDecode.role;
            // this.nmDept = this.tokenDecode.nmdept;
            // this.nmUnit = this.tokenDecode.nmunit;
            // this.nmSatker = this.tokenDecode.nmsatker;
            // this.kdDept = this.tokenDecode.ud5;
            // this.kdUnit = this.tokenDecode.ud6;
            // this.kdSatker = this.tokenDecode.ud7;
            // this.ud1 = this.tokenDecode.ud1;
            // this.ud2 = this.tokenDecode.ud2;
        }
    }

    isTokenExpired(token) {
        if (!token || token == undefined || token == 'undefined') return true;
        return this.jwtHelper.isTokenExpired(token);
    }

    getFullName() {
        var decodeToken = this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
        return decodeToken.FullName;
    }

    getMenu() {
        var decodeToken = this.jwtHelper.decodeToken(localStorage.getItem('access_token'));
        var menuApps = JSON.parse(decodeToken.Menu);
        var menuData: any = [];
        for (var i = 0; i < menuApps.length; i++) {
            if (menuApps[i].CD_APP == '11') {
                menuData.push(menuApps[i]);
            }
        }
        return menuData;
    }

    logOut(): void {
        localStorage.removeItem('access_token');
        this.token = null;
        this.router.navigate(['/']);
    }

}
