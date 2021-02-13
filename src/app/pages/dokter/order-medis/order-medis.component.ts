import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { of } from 'rxjs';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../../@core/utils/alert.service';
import { HeaderService } from '../../../@core/utils/header.service';
import { RefService } from '../../../@core/utils/ref.service';
import { PaginationComponent } from '../../../@theme/components/pagination/pagination.component';
import * as Globals from '../../../globals';
declare var $: any;


@Component({
  selector: 'ngx-order-medis',
  templateUrl: './order-medis.component.html',
  styleUrls: ['./order-medis.component.scss']
})
export class OrderMedisComponent implements OnInit, OnDestroy {

  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;

  orderMedisList$: Observable<any[]>;

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
  obatList: any = [];
  laboratList: any = [];
  historyMedis: any = {};
  orderMedis: any = {};
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
    });
  }
  ngOnInit() {
    this.getHistoryMedisByIdPemeriksaan();
    this.getOrderMedisList(1);
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

  editOrderMedis(idOrder) {
    this.loading = true;
    this.http.get(Globals.apiService + `/dokter?idOrder=${idOrder}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.orderMedis = data;
      console.log(this.orderMedis);
      this.loading = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loading = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getOrderMedisList(pageNumber: number) {
    this.loading = true;
    let pagedList: any = {};
    this.http.get(Globals.apiService + `/ordermedis?search=${this.search}&sort=${this.sort}&idPemeriksaan=${this.id}&limit=${this.pageSize}&offset=${pageNumber}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.pageNumber = pageNumber;
        pagedList.TotalPage = Math.ceil(data.TotalRecord / this.pageSize);
        console.log(data);
        this.orderMedisList$ = of(data.Data);
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

  newOrderMedis() {
    this.orderMedis = { IdOrder: 0, IdPemeriksaan: this.id };
  }

  onSelectedJenis(jenis) {
    if (jenis == '1') {
      this.refService.getListObat(this.historyMedis.ID_KLINIK)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.obatList = data;
        console.log(this.obatList);
        this.loading = false;
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.loading = false;
        this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
      })
    } else {
      this.refService.getListLab(this.historyMedis.ID_KLINIK)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(data => {
        this.laboratList = data;
        console.log(this.laboratList);
        this.loading = false;
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.loading = false;
        this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
      })
    }
  }

  saveOrderMedis() {
    this.loadingModal = true;
    console.log(this.orderMedis);
    if (!this.orderMedis.RegNo) {
      this.http.post(Globals.apiService + `/ordermedis`,this.orderMedis)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadingModal = false;
        $('#modalOrderMedis').modal('hide');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.getOrderMedisList(this.pageNumber);
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
      }, err => {
        this.loadingModal = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat simpan data", this.toastConfig);
      });
    } else {
      this.http.put(Globals.apiService + `/ordermedis?idOrder=${this.orderMedis.IdOrder}`,this.orderMedis)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadingModal = false;
        $('#modalOrderMedis').modal('hide');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.getOrderMedisList(this.pageNumber);
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

  delete() {

  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


}
