import { Component, OnInit, ViewChild, OnDestroy, TemplateRef } from '@angular/core';
import { of, Observable, Subject } from 'rxjs';
import { PaginationComponent } from '../../@theme/components/pagination/pagination.component';
import { Router, ActivatedRoute } from '@angular/router';
import * as Globals from '../../globals';
import { HttpClient } from '@angular/common/http';
import { NbToastrService, NbCalendarRange, NbDateService, NbWindowService } from '@nebular/theme';
import { HeaderService } from '../../@core/utils/header.service';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../@core/utils/alert.service';
import { IdentityService } from '../../@core/utils/identity.service';

@Component({
  selector: 'ngx-dokter',
  templateUrl: './dokter.component.html',
  styleUrls: ['./dokter.component.scss']
})
export class DokterComponent implements OnInit {

  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;

  monitoringAntrianPasienList$: Observable<any[]>;
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

  constructor(public identityService: IdentityService, private alertService: AlertService, private windowService: NbWindowService, protected dateService: NbDateService<Date>, private headerService: HeaderService, private router: Router, private route: ActivatedRoute, private http: HttpClient, public toastService: NbToastrService,) {
    this.dFrom = Globals.formatDate(dateService.addMonth(this.monthStart, -1));
    this.dTo = Globals.formatDate(dateService.addDay(this.monthEnd, 1));
    this.rangeDate = {
      start: this.dateService.addMonth(this.monthStart, -1),
      end: this.dateService.addDay(this.monthEnd, 0),
    };
  }


  get monthStart(): Date {
    return this.dateService.today();
  }

  get monthEnd(): Date {
    return this.dateService.today();
  }

  ngOnInit() {
    this.getMonitoringAntrianPasienList(this.pageNumber);
  }
  
  getMonitoringAntrianPasienList(pageNumber: number) {
    this.loading = true;
    let pagedList: any = {};
    this.http.get(Globals.apiService + `/dokter/antrianpasien?search=${this.search}&sort=${this.sort}&limit=${this.pageSize}&offset=${pageNumber}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.pageNumber = pageNumber;
        pagedList.TotalPage = Math.ceil(data.TotalRecord / this.pageSize);
        console.log(data);
        this.monitoringAntrianPasienList$ = of(data.Data);
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

  onRangeChange(event) {
    this.rangeDate = event;
    let end;
    if (event.end) end = this.dateService.addDay(<Date>event.end, 1);

    this.dFrom = Globals.formatDate(event.start || this.monthStart);
    this.dTo = Globals.formatDate(end || this.monthEnd);
  }

  onRefresh() {
    this.getMonitoringAntrianPasienList(this.pageNumber);
  }

  onGoToPasienDetail(idPemeriksaan) {
    this.router.navigate([`detail/${idPemeriksaan}/rekam-medis`], { relativeTo: this.route });
  }

  selesaikanKasus(item: any) {
    this.http.put(Globals.apiService + `/dokter/closedpemeriksaan?idPemeriksaan=${item.ID_PEMERIKSAAN}`, item)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loading = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.getMonitoringAntrianPasienList(this.pageNumber);
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
      }, err => {
        this.loading = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat simpan data", this.toastConfig);
      });
  }

  getStatusStyle(status: string) {
    let result;

    if (status.toLowerCase().indexOf('antri') != -1) {
      result = 'bg bg-info';
    } else if (status.toLowerCase().indexOf('selesai') != -1) {
      result = 'bg bg-danger';
    } else if (status.toLowerCase().indexOf('checkup') != -1) {
      result = 'bg bg-success blink_me';
    } else {
      result = 'bg bg-primary';
    }

    return result;
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
