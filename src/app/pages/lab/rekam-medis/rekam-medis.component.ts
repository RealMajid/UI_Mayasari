import { HttpClient } from '@angular/common/http';
import { OnDestroy, TemplateRef } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbCalendarRange, NbDateService, NbToastrService, NbWindowService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { of } from 'rxjs';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../../@core/utils/alert.service';
import { HeaderService } from '../../../@core/utils/header.service';
import { IdentityService } from '../../../@core/utils/identity.service';
import { PaginationComponent } from '../../../@theme/components/pagination/pagination.component';
import * as Globals from '../../../globals';
declare var $: any;

@Component({
  selector: 'ngx-rekam-medis',
  templateUrl: './rekam-medis.component.html',
  styleUrls: ['./rekam-medis.component.scss']
})
export class RekamMedisComponent implements OnInit, OnDestroy {

  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;

  monitoringLabCheckupList$: Observable<any[]>;
  unsubscribe$ = new Subject<void>();
  @ViewChild('alertTemplate', { static: true }) alertTemplate: TemplateRef<any>;
  toastConfig: any = Globals.toastConfig;
  pageNumber = 1;
  pageSize = 10;
  loading: boolean;
  rangeDate: NbCalendarRange<Date>;
  date = new Date();
  dFrom;
  dTo;
  windowRef: any;
  showErrorSendReqDoc;
  listErrorReqDoc: string[] = [];
  search: any = "";
  sort: any = "";
  loadingModal: boolean = false;
  rekamMedis: any = {};

  constructor(public identityService: IdentityService, private alertService: AlertService, private windowService: NbWindowService, protected dateService: NbDateService<Date>,
     private headerService: HeaderService, private router: Router, private route: ActivatedRoute,
      private http: HttpClient, public toastService: NbToastrService,) {
    this.dFrom = Globals.formatDate(dateService.addMonth(this.monthStart, -1));
    this.dTo = Globals.formatDate(dateService.addDay(this.monthEnd, 1));
    this.rangeDate = {
      start: this.dateService.addMonth(this.monthStart, -1),
      end: this.dateService.addDay(this.monthEnd, 0),
    };
  }

  ngOnInit(): void {
    this.getMonitoringLabCheckupList(this.pageNumber);
  }

  get monthStart(): Date {
    return this.dateService.today();
  }

  get monthEnd(): Date {
    return this.dateService.today();
  }

  getMonitoringLabCheckupList(pageNumber: number) {
    this.loading = true;
    let pagedList: any = {};
    this.http.get(Globals.apiService + `/lab?search=${this.search}&sort=${this.sort}&type=checkup&limit=${this.pageSize}&offset=${pageNumber}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.pageNumber = pageNumber;
        pagedList.TotalPage = Math.ceil(data.TotalRecord / this.pageSize);
        console.log(data);
        this.monitoringLabCheckupList$ = of(data.Data);
        this.child.getPagination(pageNumber, pagedList);
        this.loading = false;
      }, err => {
        if (err.error.Message) {
          this.loading = false;
        } else {
          this.loading = false;
        }
      });
  }

  getRekamMedisByIdPemeriksaan(IdPemeriksaan) {
    this.loadingModal = true;
    this.http.get(Globals.apiService + `/lab?idPemeriksaan=${IdPemeriksaan}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.rekamMedis = data;
      console.log(this.rekamMedis);
      this.loadingModal = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingModal = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  saveRekamMedis() {
    this.loadingModal = true;
      this.http.put(Globals.apiService + `/lab?idRekamMedis=${this.rekamMedis.ID_REKAM_MEDIS}`,this.rekamMedis)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadingModal = false;
        $('#modalRegisterPasien').modal('hide');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.getMonitoringLabCheckupList(1);
      }, err => {
        this.loadingModal = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat simpan data", this.toastConfig);
      });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
