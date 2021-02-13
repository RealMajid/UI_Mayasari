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

@Component({
  selector: 'ngx-reqdoc',
  templateUrl: './reqdoc.component.html',
  styleUrls: ['./reqdoc.component.scss']
})
export class ReqdocComponent implements OnInit, OnDestroy {

  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;

  reqDocList$: Observable<any[]>;
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

  constructor(private alertService: AlertService, private windowService: NbWindowService, protected dateService: NbDateService<Date>, private headerService: HeaderService, private router: Router, private route: ActivatedRoute, private http: HttpClient, public toastService: NbToastrService,) {
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
    this.getReqDocList(this.pageNumber);
  }

  getReqDocList(pageNumber: number) {
    this.loading = true;
    let pagedList: any = {};
    this.http.get(Globals.apiService + `/ReqDoc?dFrom=${this.dFrom}&dTo=${this.dTo}&limit=${this.pageSize}&offset=${pageNumber}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.pageNumber = pageNumber;
        pagedList.TotalPage = Math.ceil(data.total_record / this.pageSize);
        console.log(data);
        this.reqDocList$ = of(data.data);
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

    console.log(this.dFrom, this.dTo);
  }

  onRefresh() {
    this.getReqDocList(this.pageNumber);
  }

  onGoToReqdocDetail(RdId) {
    this.router.navigate([`${RdId}/surat`], { relativeTo: this.route });
  }

  newRequestDocument() {
    this.router.navigate([`0/surat`], { relativeTo: this.route });
  }

  onSendToKanwil(rdId, requestDocument) {
    this.windowRef = this.windowService.open(this.alertTemplate, { title: 'Kirim Dokumen Permintaan ke Kanwil', context: { rd_id: rdId, reqDoc: requestDocument } });
  }

  sendReqDocToKanwil(rdId, reqDoc, windowRef) {
    if(!reqDoc.req_no || !reqDoc.d_req || !reqDoc.subject) {
      this.showErrorSendReqDoc = true;
      if (!reqDoc.req_no) this.listErrorReqDoc.push("Nomor Surat belum diinput");
      if (!reqDoc.d_req) this.listErrorReqDoc.push("Tanggal Penandatangan Surat belum diinput");
      if (!reqDoc.subject) this.listErrorReqDoc.push("Perihal Surat belum diinput");

      return;
    }
    this.showErrorSendReqDoc = false;
    this.listErrorReqDoc = [];
    windowRef.close();

    this.loading = true;
    reqDoc.send_to_kanwil_yn = "Y";
    this.http.put(Globals.apiService + `/reqdoc/sendtokanwil/${rdId}`, reqDoc)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loading = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.getReqDocList(1);
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
      }, err => {
        this.loading = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Gagal mengirim dokumen", this.toastConfig);
      })
  }

  getStatusStyle(status: string) {
    let result;

    if (status.toLowerCase().indexOf('proses') != -1) {
      result = 'badge badge-info';
    } else if (status.toLowerCase().indexOf('selesai') != -1) {
      result = 'badge badge-success';
    } else if (status.toLowerCase().indexOf('kanwil') != -1) {
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
