import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../../@core/utils/alert.service';
import { HeaderService } from '../../../@core/utils/header.service';
import { RefService } from '../../../@core/utils/ref.service';
import * as Globals from '../../../globals';

@Component({
  selector: 'ngx-rekam-medis',
  templateUrl: './rekam-medis.component.html',
  styleUrls: ['./rekam-medis.component.scss']
})
export class RekamMedisComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();
  toastConfig: any = Globals.toastConfig;
  pageNumber = 1;
  pageSize = 10;
  loading: boolean;
  date = new Date();
  dFrom;
  dTo;
  windowRef: any;
  showErrorSendReqDoc;
  listErrorReqDoc: string[] = [];
  historyMedis: any = {};
  rekamMedis: any = {};
  loadingModal: boolean;
  jenisKelamin: any;
  klinikList: any;
  search: any = "";
  sort: any = ""  ;
  sub: any;
  id: any;
  tab: any;
  pasien: any = {}; 
  
  constructor(private refService: RefService, private alertService: AlertService, private headerService: HeaderService, private router: Router, private route: ActivatedRoute, private http: HttpClient, public toastService: NbToastrService) {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];

      this.rekamMedis.IdPemeriksaan = this.id;
      this.rekamMedis.IdRekamMedis = 0;
    });
  }
  ngOnInit() {
    this.getHistoryMedisByIdPemeriksaan();
    this.getRekamMedisByIdPemeriksaan();
  }

  getHistoryMedisByIdPemeriksaan() {
    this.loading = true;
    this.http.get(Globals.apiService + `/dokter?idPemeriksaan=${this.id}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.historyMedis = data;
      console.log(this.historyMedis);
      this.loading = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loading = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getRekamMedisByIdPemeriksaan() {
    this.loading = true;
    this.http.get(Globals.apiService + `/dokter/rekammedis?idPemeriksaan=${this.id}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      if(data != null) this.rekamMedis = data;
      console.log(this.rekamMedis);
      this.loading = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loading = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  saveRekamMedis() {
    this.loadingModal = true;
    if (!this.rekamMedis.IdRekamMedis) {
      this.http.post(Globals.apiService + `/dokter/RekamMedis`,this.rekamMedis)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadingModal = false;
        this.rekamMedis = res;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
      }, err => {
        this.loadingModal = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat simpan data", this.toastConfig);
      });
    } else {
      this.http.put(Globals.apiService + `/dokter/RekamMedis?idPemeriksaan=${this.id}`,this.rekamMedis)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadingModal = false;
        this.rekamMedis = res;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
      }, err => {
        this.loadingModal = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat simpan data", this.toastConfig);
      });
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
