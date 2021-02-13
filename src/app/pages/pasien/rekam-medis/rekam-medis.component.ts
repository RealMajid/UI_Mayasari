import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter, OnDestroy, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of, concat, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RefService } from '../../../@core/utils/ref.service';
import { NbToastrService, NbWindowService, NbWindowRef } from '@nebular/theme';
import { AlertService } from '../../../@core/utils/alert.service';
import * as Globals from '../../../globals';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter, takeUntil } from 'rxjs/operators';
import { HeaderService } from '../../../@core/utils/header.service';
import { IdentityService } from '../../../@core/utils/identity.service';

@Component({
  selector: 'ngx-rekam-medis',
  templateUrl: './rekam-medis.component.html',
  styleUrls: ['./rekam-medis.component.scss']
})
export class RekamMedisComponent implements OnInit {

  private sub: any;
  id: number;
  tab: any;
  kementerianLembaga: any;
  satker: any;
  selectedKl: any;
  selectedSatker: any;
  toastConfig: any = Globals.toastConfig;
  loadingDepartemen: boolean;
  loadingSatker: boolean;
  loadingProvinsi: boolean;
  loadingSave: boolean;
  loadingDelete: boolean;
  historyMedis: any = {};
  @ViewChild('alertTemplate', { static: true }) alertTemplate: TemplateRef<any>;
  @ViewChild('refTemplate', { static: true }) refTemplate: TemplateRef<any>;
  windowRef: any;
  departemenList = [];
  satkerList = [];
  lokasiList: any = [];
  letterSubject;
  tokenDecode;
  @Output() loadDocument = new EventEmitter();
  @Output() reqDocLoaded = new EventEmitter();
  unsubscribe$ = new Subject<void>();
  loadingWindowRef: boolean;
  searchRef: any;
  lokasi: any;
  selectedLokasi: any;
  Labs: any = [];
  Obats: any = [];
  rekamMedis: any = {};
  loading: boolean;

  constructor(private changeDetectionRef: ChangeDetectorRef, private identityService: IdentityService, private windowService: NbWindowService, private router: Router ,private alertService: AlertService, private route: ActivatedRoute, private refService: RefService, private toastService: NbToastrService, private http: HttpClient, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];
    });
    // if (this.id > 0) {
    //     this.getReqDocById(this.id);
    // } else {
    //     this.getListDepartemen();
    // }
    this.getStatusTungguByIdPemeriksaan();
    this.getRekamMedisByIdPemeriksaan();
  }

  getStatusTungguByIdPemeriksaan() {
    this.loading = true;
    let urlAPI = this.id > 0 ? `/pasien?idPemeriksaan=${this.id}` : `/pasien/recent`;
    this.http.get(Globals.apiService + urlAPI)
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
    let urlAPI = this.id > 0 ? `/dokter/rekammedis?idPemeriksaan=${this.id}` :  `/pasien/recentrekammedis`;
    this.http.get(Globals.apiService + urlAPI)
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


  confirmDelete() {
    this.windowRef = this.windowService.open(this.alertTemplate, { title: 'Hapus Dokumen Permintaan' });
  }

  searchReference(refData, type) {
    let val = this.searchRef;
    if (val && val.trim() != '') {
      return refData.filter(item => {
        return (item.id.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.value.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      if (type == 'kl') {
        return this.departemenList;
      } else if (type == 'satker') {
        return this.satkerList;
      } else {
        return this.lokasiList;
      }
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
