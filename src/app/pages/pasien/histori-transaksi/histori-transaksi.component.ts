import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { PaginationComponent } from '../../../@theme/components/pagination/pagination.component';
import { of, Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { RefService } from '../../../@core/utils/ref.service';
import * as Globals from '../../../globals';
import { AlertService } from '../../../@core/utils/alert.service';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-histori-transaksi',
  templateUrl: './histori-transaksi.component.html',
  styleUrls: ['./histori-transaksi.component.scss']
})
export class HistoriTransaksiComponent implements OnInit {

  @ViewChild(PaginationComponent, {static: true}) child: PaginationComponent;
  historiTransaksiList$: Observable<any[]>;
  pageNumber = 1;
  pageSize = 5;
  @Output() loadLokasi = new EventEmitter();
  @Input() registerNo: any;
  @Input() step: any;
  lokasiList;
  kabupatenKotaList;
  private sub: any;
  id: number;
  tab: any;
  rcId: number;
  toastConfig: any = Globals.toastConfig;
  sort;
  registerLocation;
  unsubscribe$ = new Subject<void>();
  loading: boolean;
  search: any;

  constructor(private http: HttpClient,private alertService: AlertService,private toastService: NbToastrService, private router: Router, private route: ActivatedRoute, private dialogService: NbDialogService) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];
    });
    this.getOrderMedisList(this.pageNumber);
  }

  getOrderMedisList(pageNumber: number) {
    this.loading = true;
    let urlAPI = this.id > 0 ? `/pasien/order?search=${this.search}&sort=${this.sort}&idPemeriksaan=${this.id}&limit=${this.pageSize}&offset=${pageNumber}` : `/pasien/recentordermedis?search=${this.search}&sort=${this.sort}&limit=${this.pageSize}&offset=${pageNumber}`;
    let pagedList: any = {};
    this.http.get(Globals.apiService + urlAPI)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.pageNumber = pageNumber;
        pagedList.TotalPage = Math.ceil(data.TotalRecord / this.pageSize);
        console.log(data);
        this.historiTransaksiList$ = of(data.Data);
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

  // getRegisterLocationList(pageNumber: number) {
  //   this.loadLokasi.emit('true');
  //   let pagedList: any = {};
  //   this.http.get(Globals.apiService + `/RegisterLocation?rc_id=${this.rcId}&sort=${this.sort}&limit=${this.pageSize}&offset=${pageNumber}`)
  //   .pipe(takeUntil(this.unsubscribe$))  
  //   .subscribe((data: any) => {
  //       pagedList.TotalPage = Math.ceil(data.total_record / this.pageSize);
  //       // this.lokasiList$ = of(data.data);
  //       this.child.getPagination(pageNumber, pagedList);
  //       console.log(data);
  //       this.loadLokasi.emit('false');
  //     }, err => {
  //       if (err.error.Message) {
  //         this.loadLokasi.emit('false');
  //       } else {
  //         this.loadLokasi.emit('false');
  //       }
  //     });
  // }

  // save() {
  //   this.loadLokasi.emit('true');
  //   if (this.registerLocation.rl_id == 0) {
  //     this.http.post(Globals.apiService + '/registerlocation', this.registerLocation)
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe((res: any) => {
  //       this.loadLokasi.emit('false');
  //       this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
  //       this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
  //       this.toastConfig.pack = 'eva';
  //       this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
  //       this.getRegisterLocationList(1);
  //     }, err => {
  //       this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
  //       this.toastConfig.icon = Globals.ToastIcon.Close;
  //       this.toastConfig.pack = 'eva';
  //       this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
  //       this.loadLokasi.emit('false');
  //     })
  //   } else {
  //     this.http.put(Globals.apiService + `/registerlocation/${this.registerLocation.rl_id}`, this.registerLocation)
  //     .pipe(takeUntil(this.unsubscribe$))
  //     .subscribe((res: any) => {
  //       this.loadLokasi.emit('false');
  //       this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
  //       this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
  //       this.toastConfig.pack = 'eva';
  //       this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
  //       this.getRegisterLocationList(1);
  //     }, err => {
  //       this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
  //       this.toastConfig.icon = Globals.ToastIcon.Close;
  //       this.toastConfig.pack = 'eva';
  //       this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
  //       this.loadLokasi.emit('false');
  //     })
  //   }
  // }

  // deleteLokasi(id) {
  //   this.loadLokasi.emit('true');
  //   this.http.delete(Globals.apiService + `/registerlocation/${id}`)
  //   .pipe(takeUntil(this.unsubscribe$))
  //   .subscribe((res: any) => {
  //     this.loadLokasi.emit('false');
  //     // this.lokasiList$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => { if(data.length == 1) data.pop() });
  //     this.getRegisterLocationList(1);
  //     this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
  //     this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
  //     this.toastConfig.pack = 'eva';
  //     this.toastService.show("Data Berhasil Dihapus", "Sukses", this.toastConfig);
  //   }, err => {
  //     this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
  //     this.toastConfig.icon = Globals.ToastIcon.Close;
  //     this.toastConfig.pack = 'eva';
  //     this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
  //     this.loadLokasi.emit('false');
  //   })
  // }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
