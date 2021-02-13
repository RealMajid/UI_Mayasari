import { Component, OnInit, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { of, Observable, Subject } from 'rxjs';
import { PaginationComponent } from '../../../@theme/components/pagination/pagination.component';
import { Router, ActivatedRoute } from '@angular/router';
import * as Globals from '../../../globals';
import { HttpClient } from '@angular/common/http';
import { NbToastrService, NbCalendarRange, NbDateService, NbWindowService } from '@nebular/theme';
import { HeaderService } from '../../../@core/utils/header.service';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../../@core/utils/alert.service';
import { RefService } from '../../../@core/utils/ref.service';
declare var $: any;

@Component({
  selector: 'ngx-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.scss']
})
export class MonitoringComponent implements OnInit, OnDestroy {

  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;

  monitoringDokterList$: Observable<any[]>;
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
  registerKasus: any = {};
  loadingModal: boolean;
  jenisKelamin: any;
  klinikList: any;
  search: any = "";
  sort: any = ""  ;

  constructor(private refService: RefService, private alertService: AlertService, private windowService: NbWindowService, protected dateService: NbDateService<Date>, private headerService: HeaderService, private router: Router, private route: ActivatedRoute, private http: HttpClient, public toastService: NbToastrService,) {

  }

  ngOnInit() {
    this.getMonitoringDokterList(1);
  }

  getMonitoringDokterList(pageNumber: number) {
    this.loading = true;
    let pagedList: any = {};
    this.http.get(Globals.apiService + `/ref/monitoringdokter?search=${this.search}&sort=${this.sort}&limit=${this.pageSize}&offset=${pageNumber}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.pageNumber = pageNumber;
        pagedList.TotalPage = Math.ceil(data.TotalRecord / this.pageSize);
        console.log(data);
        this.monitoringDokterList$ = of(data.Data);
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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
