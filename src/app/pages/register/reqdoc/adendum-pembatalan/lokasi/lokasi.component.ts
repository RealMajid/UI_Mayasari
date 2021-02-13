import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy, Input } from '@angular/core';
import { PaginationComponent } from '../../../../../@theme/components/pagination/pagination.component';
import { of, Observable, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { LokasiWindowComponent } from './lokasi-window/lokasi-window.component';
import { RefService } from '../../../../../@core/utils/ref.service';
import * as Globals from '../../../../../globals';
import { AlertService } from '../../../../../@core/utils/alert.service';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-lokasi',
  templateUrl: './lokasi.component.html',
  styleUrls: ['./lokasi.component.scss']
})
export class LokasiComponent implements OnInit, OnDestroy {

  @ViewChild(PaginationComponent, {static: true}) child: PaginationComponent;
  lokasiList$: Observable<any[]>;
  pageNumber = 1;
  pageSize = 5;
  @Output() loadLokasi = new EventEmitter();
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
  isPembatalan: boolean;

  constructor(private http: HttpClient,private alertService: AlertService,private toastService: NbToastrService, private router: Router, private route: ActivatedRoute, private dialogService: NbDialogService) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];
      this.rcId = params["rcid"];
    });
    this.registerLocation = { rc_id: this.rcId }
    this.getRegisterLocationList(1);
    if(this.router.url.indexOf('pembatalan') != -1) this.isPembatalan = true;
  }

  getRegisterLocationList(pageNumber: number) {
    this.loadLokasi.emit('true');
    let pagedList: any = {};
    this.http.get(Globals.apiService + `/RegisterLocation?rc_id=${this.rcId}&sort=${this.sort}&limit=${this.pageSize}&offset=${pageNumber}`)
    .pipe(takeUntil(this.unsubscribe$))  
    .subscribe((data: any) => {
        pagedList.TotalPage = Math.ceil(data.total_record / this.pageSize);
        this.lokasiList$ = of(data.data);
        this.child.getPagination(pageNumber, pagedList);
        console.log(data);
        this.loadLokasi.emit('false');
      }, err => {
        if (err.error.Message) {
          this.loadLokasi.emit('false');
        } else {
          this.loadLokasi.emit('false');
        }
      });
  }

  newLokasi() {
    this.dialogService.open(LokasiWindowComponent, { context : { type: "new" } }).onClose
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(loc => {
        if (loc == null || loc == undefined || loc == 'cancel') return;
        this.registerLocation.rl_id = 0;
        this.registerLocation.rc_id = this.rcId;
        this.registerLocation.kdlokasi = loc.kdlokasi;
        this.registerLocation.kdkabkota = loc.kdkabkota;
        this.save();
        console.log(loc);
      })
  }

  editLokasi(item) {    
    let lokasi = {...item};
    this.dialogService.open(LokasiWindowComponent, { context: { type: "edit", lokasi } }).onClose
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(loc => {
      if (loc == null || loc == undefined || loc == 'cancel') return;
      this.registerLocation = loc;
      this.save();
      console.log(loc);
    });
  }

  save() {
    this.loadLokasi.emit('true');
    if (this.registerLocation.rl_id == 0) {
      this.http.post(Globals.apiService + '/registerlocation', this.registerLocation)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadLokasi.emit('false');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.getRegisterLocationList(1);
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
        this.loadLokasi.emit('false');
      })
    } else {
      this.http.put(Globals.apiService + `/registerlocation/${this.registerLocation.rl_id}`, this.registerLocation)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadLokasi.emit('false');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.getRegisterLocationList(1);
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
        this.loadLokasi.emit('false');
      })
    }
  }

  deleteLokasi(id) {
    this.loadLokasi.emit('true');
    this.http.delete(Globals.apiService + `/registerlocation/${id}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: any) => {
      this.loadLokasi.emit('false');
      this.lokasiList$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => { if(data.length == 1) data.pop() });
      this.getRegisterLocationList(1);
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
      this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
      this.toastConfig.pack = 'eva';
      this.toastService.show("Data Berhasil Dihapus", "Sukses", this.toastConfig);
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastConfig.icon = Globals.ToastIcon.Close;
      this.toastConfig.pack = 'eva';
      this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
      this.loadLokasi.emit('false');
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
