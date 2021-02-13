import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import * as Globals from '../../globals';
import { observable, Observable, of, Subject } from 'rxjs';
import { NbToastrService } from '@nebular/theme';
import { AlertService } from '../../@core/utils/alert.service';
import { PaginationComponent } from '../../@theme/components/pagination/pagination.component';
import { RefService } from '../../@core/utils/ref.service';



@Component({
  selector: 'ngx-ecommerce',
  templateUrl: './e-commerce.component.html',
  styleUrls: ['./e-commerce.component.scss']
})
export class ECommerceComponent implements OnInit, OnDestroy {
  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;

  registerKasusList$: Observable<any[]>;
  dashboardViewModel: any = {};
  toastConfig: any = Globals.toastConfig;
  monitorKasusList$: Observable<any[]>;
  unsubscribe$ = new Subject<void>();
  pieChartData: any;
  areaStackData: any;
  loading: boolean;
  pageNumber = 1;
  pageSize = 5;
  search: any = "";
  sort: any = ""  ;
  loadingModal: boolean;
  registerKasus: any = {};
  klinikList: any = [];

  constructor(private refService: RefService, private http: HttpClient, private toastService: NbToastrService, private alertService: AlertService) {

  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // let dataMonitoring = [
    //   { KASUS: '001', VALUE: 100, STATUS: 'closed', DOKTER: 'Dr. Ari' },
    //   { KASUS: '002', VALUE: 75, STATUS: 'checkup', DOKTER: 'Dr. Pita' },
    //   { KASUS: '003', VALUE: 75, STATUS: 'checkup', DOKTER: 'Dr. Abdul' },
    //   { KASUS: '004', VALUE: 25, STATUS: 'registered', DOKTER: 'Dr. Ari' },
    //   { KASUS: '005', VALUE: 50, STATUS: 'queuing', DOKTER: 'Dr. Pita' },
    // ]

    // this.monitorKasusList$ = of(dataMonitoring);
    this.getDashboardData();
    this.getListKlinik();
    this.getRegisterKasusList(this.pageNumber);
  }

  getRegisterKasusList(pageNumber: number) {
    this.loading = true;
    let pagedList: any = {};
    this.http.get(Globals.apiService + `/RegisterKasus?search=${this.search}&sort=${this.sort}&limit=${this.pageSize}&offset=${pageNumber}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.pageNumber = pageNumber;
        pagedList.TotalPage = Math.ceil(data.TotalRecord / this.pageSize);
        console.log(data);
        this.registerKasusList$ = of(data.Data);
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

  getStatus(item: string) {
    let val = item.toLowerCase();
    switch (val) {
      case 'closed':
        return 'danger';
      case 'checkup':
        return 'success';
      case 'registered':
        return 'primary';
      case 'queuing':
        return 'info';
      default:
        return 'primary';
    }
  }

  getValue(item: string) {
    let val = item.toLowerCase();
    switch (val) {
      case 'closed':
        return 100;
      case 'checkup':
        return 75;
      case 'registered':
        return 25;
      case 'queuing':
        return 50;
      default:
        return 25;
    }
  }

  editRegisterKasus(regNo: any) {
    this.loadingModal = true;
    this.http.get(Globals.apiService + `/RegisterKasus?regNo=${regNo}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.registerKasus = data;
      this.registerKasus.TglLahir = Globals.formatDate(new Date(this.registerKasus.TglLahir));
      this.registerKasus.RegNo = regNo;
      this.loadingModal = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingModal = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getDashboardData() {
    this.http.get(Globals.apiService + `/dashboard/aggregatestatus`)
    .pipe(takeUntil(this.unsubscribe$))  
    .subscribe((data: any) => {
        console.log(data);
        this.dashboardViewModel = data;
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
      });
  }

  getListKlinik() {
    this.loading = true;
    this.refService.getListKlinik()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.klinikList = data;
      console.log(this.klinikList);
      this.loading = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loading = false;
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
