import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as Globals from '../../globals';

@Injectable({
  providedIn: 'root'
})
export class RefService {
  urlApi = Globals.apiService + '/ref';
  constructor(private http: HttpClient) { }

  getListDepartemen(): Observable<any> {
    return this.http.get(this.urlApi + '/dept');
  }

  getListParticipant(): Observable<any> {
    return this.http.get(this.urlApi + '/part');
  }

  getListDeptParticipant(): Observable<any> {
    return this.http.get(this.urlApi + '/dept_part');
  }

  getListSatker(kdDept: string, kdUnit: string = ""): Observable<any> {
    return this.http.get(`${this.urlApi}/satker?kdDept=${kdDept}&kdUnit=${kdUnit}`);
  }

  getListAllSatker(): Observable<any> {
    return this.http.get(this.urlApi + '/satkerall');
  }

  
  getListNegara(): Observable<any> {
    return this.http.get(this.urlApi + '/cntries');
  }

  getListLokasi(): Observable<any> {
    return this.http.get(`${this.urlApi}/lokasi`);
  }

  getListKabupatenKota(kdLokasi: string): Observable<any> {
    return this.http.get(`${this.urlApi}/kabkot?kdLokasi=${kdLokasi}`);
  }

  getRefRegister(): Observable<any> {
    return this.http.get(`${this.urlApi}/refregister`);
  }

  getListSumberPembiayaan(): Observable<any> {
    return this.http.get(`${this.urlApi}/finsour`);
  }

  getListPemberiHibah(cd_parent: String): Observable<any> {
    return this.http.get(`${this.urlApi}/donor?cd_parent=${cd_parent}`);
  }

  getListKlinik(): Observable<any> {
    return this.http.get(`${this.urlApi}/klinik`);
  }

  getMonitoringDokter(): Observable<any> {
    return this.http.get(`${this.urlApi}/monitoringdokter`);
  }

  getListObat(idKlinik: number): Observable<any> {
    return this.http.get(`${this.urlApi}/obat?idKlinik=${idKlinik}`);
  }

  getListLab(idKlinik: number): Observable<any> {
    return this.http.get(`${this.urlApi}/lab?idKlinik=${idKlinik}`);
  }

}

