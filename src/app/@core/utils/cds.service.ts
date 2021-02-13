import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Globals from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class CdsService {
  urlApi = Globals.apiService + '/cds';
  constructor(private http: HttpClient) { }

  getJenisPembiayaanList(): Observable<any> {
    return this.http.get(this.urlApi + '/jenispembiayaan');
  }

}

