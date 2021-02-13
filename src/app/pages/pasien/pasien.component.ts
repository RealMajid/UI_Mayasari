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
  selector: 'ngx-pasien',
  templateUrl: './pasien.component.html',
  styleUrls: ['./pasien.component.scss']
})
export class PasienComponent implements OnInit {

  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;

  historyMedisPasienList$: Observable<any[]>;
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

  constructor(public identityService: IdentityService,private alertService: AlertService, private windowService: NbWindowService, protected dateService: NbDateService<Date>, private headerService: HeaderService, private router: Router, private route: ActivatedRoute, private http: HttpClient, public toastService: NbToastrService,) {
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
    this.getHistoryMedisPasienList(this.pageNumber);
  }
  
  getHistoryMedisPasienList(pageNumber: number) {
    this.loading = true;
    let pagedList: any = {};
    this.http.get(Globals.apiService + `/pasien/historymedis?search=${this.search}&sort=${this.sort}&limit=${this.pageSize}&offset=${pageNumber}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.pageNumber = pageNumber;
        pagedList.TotalPage = Math.ceil(data.TotalRecord / this.pageSize);
        console.log(data);
        this.historyMedisPasienList$ = of(data.Data);
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
    this.getHistoryMedisPasienList(this.pageNumber);
  }

  onGoToPasienDetail(idPemeriksaan) {
    this.router.navigate([`${idPemeriksaan}/status`], { relativeTo: this.route });
  }

  getStatusStyle(status: string) {
    let result;

    if (status.toLowerCase().indexOf('antri') != -1) {
      result = 'badge badge-info';
    } else if (status.toLowerCase().indexOf('selesai') != -1) {
      result = 'badge badge-danger';
    } else if (status.toLowerCase().indexOf('checkup') != -1) {
      result = 'badge badge-success';
    } else {
      result = 'badge badge-primary';
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
