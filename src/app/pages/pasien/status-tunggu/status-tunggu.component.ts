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
  selector: 'ngx-status-tunggu',
  templateUrl: './status-tunggu.component.html',
  styleUrls: ['./status-tunggu.component.scss']
})
export class StatusTungguComponent implements OnInit, OnDestroy {
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
  statusTunggu: any = {};
  loadingModal: boolean;
  jenisKelamin: any;
  klinikList: any;
  search: any = "";
  sort: any = ""  ;
  sub: any;
  id: any;
  tab: any;

  constructor(private refService: RefService, private alertService: AlertService, private headerService: HeaderService, private router: Router, private route: ActivatedRoute, private http: HttpClient, public toastService: NbToastrService) {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];
    });
  }

  ngOnInit() {
    this.getStatusTungguByIdPemeriksaan();
  }

  getStatusTungguByIdPemeriksaan() {
    this.loading = true;
    let urlAPI = this.id > 0 ? `/pasien?idPemeriksaan=${this.id}` : '/pasien/recent';
    this.http.get(Globals.apiService + urlAPI)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.statusTunggu = data;
      console.log(this.statusTunggu);
      this.loading = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loading = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  
  getStatusStyle(status: string) {
    let result;

    if (status.toLowerCase().indexOf('antri') != -1) {
      result = 'bg bg-info';
    } else if (status.toLowerCase().indexOf('selesai') != -1) {
      result = 'bg bg-danger';
    } else if (status.toLowerCase().indexOf('checkup') != -1) {
      result = 'bg bg-success';
    } else {
      result = 'bg bg-primary';
    }

    result += " card-body"

    return result;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
