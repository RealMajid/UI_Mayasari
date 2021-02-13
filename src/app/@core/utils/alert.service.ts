import { Injectable } from '@angular/core';
import { Router } from "@angular/router";
//import * as Globals from 'src/app/globals';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private router:Router) { }
  getHttpError(err: any) {
    let alternativeErrorMessage;
    if (err.error.errors && err.error.errors.amt.length > 0) {
      alternativeErrorMessage = err.error.errors.amt.join();
    }
    var message: string;
    switch (err.status) {
      case 0:
        message = 'Tidak terkoneksi dengan API service.';
        break;
      case 401:
        message = 'Unauthorized.';
        this.router.navigate(['/login']);
        break;
      case 403:
        message = 'Forbidden.';
        //this.router.navigate(['/login']);
        break;
      case 404:
        if (err.error != null) {
          message = err.error.message;
        } else {
          message = 'Service tidak ditemukan.';
        }
        break;
      default:
        message =  err.error.message || alternativeErrorMessage;
        break;
    }
    return message;
  }
}
