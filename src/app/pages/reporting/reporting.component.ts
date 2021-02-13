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


let data = [{
  IdLaporan: 1,
  NamaLaporan: "Laporan Register Kasus"
}, {
  IdLaporan: 2,
  NamaLaporan: "Laporan Alokasi Dokter"
}, {
  IdLaporan: 3,
  NamaLaporan: "Laporan Pemeriksaan Pasien"
}, {
  IdLaporan: 4,
  NamaLaporan: "Laporan Kinerja Dokter"
}]

@Component({
  selector: 'ngx-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.scss']
})

export class ReportingComponent implements OnInit, OnDestroy {

  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;

  jenisLaporanList$: Observable<any[]>;
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

  }

  ngOnInit() {
    this.jenisLaporanList$ = of(data);
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

  onCetakLaporan(IdLaporan, format: string) {
    let reportUrl;
    switch (IdLaporan) {
      case 1:
        reportUrl = "/RptRegisterKasus"
        break;
      case 2:
        reportUrl = "/RptAlokasiDokter"
        break;
      case 3:
        reportUrl = "/RptPemeriksaanPasien"
        break;
      case 4:
        reportUrl = "/RptKinerjaDokter  "
        break;
      default:
        break;
    }
    reportUrl += "?format=" + format;
    var pageURL = "";
    pageURL = Globals.reportService + reportUrl;
    this.setReport('Laporan', pageURL);
  }

  setReport(title: string, pageURL: string) {
    var pageURL = pageURL;
    var title = title;
    var w = 800;
    var h = 600;
    var left = (screen.width / 2) - (w / 2);
    var top = (screen.height / 2) - (h / 2);
    var targetWin = window.open(pageURL, title, 'toolbar=no,fullscreen=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=false, copyhistory=no, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
