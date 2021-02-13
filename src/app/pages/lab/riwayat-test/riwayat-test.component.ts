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

@Component({
  selector: 'ngx-riwayat-test',
  templateUrl: './riwayat-test.component.html',
  styleUrls: ['./riwayat-test.component.scss']
})
export class RiwayatTestComponent implements OnInit {

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
  rekamMedis: any = {};
  loadingModal = false;

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
    this.http.get(Globals.apiService + `/lab?search=${this.search}&sort=${this.sort}&type=closed&limit=${this.pageSize}&offset=${pageNumber}`)
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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
