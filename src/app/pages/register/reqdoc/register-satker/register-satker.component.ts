import { Component, OnInit, ViewChild, Output, EventEmitter, TemplateRef, ViewContainerRef, ChangeDetectorRef, Input } from '@angular/core';
import { PaginationComponent } from '../../../../@theme/components/pagination/pagination.component';
import { Observable, of, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import * as Globals from '../../../../globals';
import { HttpClient } from '@angular/common/http';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { takeUntil } from 'rxjs/operators';
import { NbToastrService, NbWindowService, NbDialogService } from '@nebular/theme';
import { AlertService } from '../../../../@core/utils/alert.service';
import { SummaryWindowComponent } from './summary-window/summary-window.component';

@Component({
  selector: 'ngx-register-satker',
  templateUrl: './register-satker.component.html',
  styleUrls: ['./register-satker.component.scss']
})
export class RegisterSatkerComponent implements OnInit {

  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;
  unsubscribe$ = new Subject<void>();
  @ViewChild('nphTemplate', { static: true }) nphTemplate: TemplateRef<any>;
  windowRef: any;
  toastConfig: any = Globals.toastConfig;
  private sub: any;
  id: number;
  tab: any;
  reqDocList$: Observable<any[]>;
  pageNumber = 1;
  pageSize = 5;
  searchRegister;
  sort;
  @Output() loadRegister = new EventEmitter();
  @Input() sentToKanwil: any;
  summaryHibah: any = {};
  implementingAgencies: any = [];
  rencanaPenarikan: any = [];
  lokasiProyek: any = [];
  donor: any = {};
  loadingSummary: boolean;

  constructor(private changeDetectionRef: ChangeDetectorRef, private http: HttpClient, private router: Router, private route: ActivatedRoute, private toastService: NbToastrService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];
    });
    this.getRegisterList(1);
  }

  onViewRingkasanHibah(id) {
    this.loadingSummary = true;
    this.http.get(Globals.apiService + `/report/summaryhibah/${id}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.summaryHibah = data.data;
        this.implementingAgencies = this.summaryHibah.implementing_agencies;
        this.donor = this.summaryHibah.donor;
        this.rencanaPenarikan = this.summaryHibah.rencana_penarikan;
        this.lokasiProyek = this.summaryHibah.lokasi_proyek;
        // this.dialogService.open(SummaryWindowComponent, { context : { summaryHibah: this.summaryHibah, implementingAgencies: this.implementingAgencies,
        // donor: this.donor, lokasiProyek: this.lokasiProyek }, hasScroll: true, viewContainerRef: this.vcr }).onClose
        // .pipe(takeUntil(this.unsubscribe$))
        // .subscribe(dsb => {
        //   if (dsb == null || dsb == undefined || dsb == 'cancel') return;
        //   console.log(dsb);
        // })
        console.log(this.summaryHibah);
        this.loadingSummary = false;
        this.changeDetectionRef.detectChanges();
      }, err => {
        this.loadingSummary = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
      })
  }

  public captureScreen() {
    this.loadRegister.emit('true');

    var data = document.getElementById('pdfTable');
    html2canvas(data).then(canvas => {
      // Few necessary setting options  
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save('MYPdf.pdf'); // Generated PDF   
      this.loadRegister.emit('false');
    });
  }

  getRegisterList(pageNumber: number) {
    this.loadRegister.emit('true');
    this.pageNumber = pageNumber;
    let pagedList: any = {};
    this.http.get(Globals.apiService + `/register?rd_id=${this.id}&search=${this.searchRegister}&sort=${this.sort}&limit=${this.pageSize}&offset=${pageNumber}`)
      .subscribe((data: any) => {
        pagedList.TotalPage = Math.ceil(data.total_record / this.pageSize);
        this.reqDocList$ = of(data.data);
        this.child.getPagination(pageNumber, pagedList);
        this.loadRegister.emit('false');
      }, err => {
        if (err.error.Message) {
          this.loadRegister.emit('false');
        } else {
          this.loadRegister.emit('false');
        }
      });
  }

  onGoToRegisterDetail(rcId, statusRegister) {
    //this.router.navigate([`${rcId}`], {relativeTo: this.route});
    let jenis;
    switch (statusRegister) {
      case 1:
        jenis = 'register'
        break;
      case 2:
        jenis = 'adendum'
        break;
      case 4:
        jenis = 'pembatalan'
        break;
      default:
        break;
    }
    this.router.navigate([`/pages/register/reqdoc/${this.id}/${jenis}/${rcId}`]);
  }

  onGoToAdendumPembatalan(rcId, jenis) {
    this.router.navigate([`/pages/register/reqdoc/${this.id}/${jenis}/${rcId}`]);
  }

  onNewRegister(rcId, jenis) {
    this.router.navigate([`/pages/register/reqdoc/${this.id}/${jenis}/${rcId}`]);
  }

  getStatusStyle(status: string) {
    let result;
     if (status.toLowerCase().indexOf('pembatalan') != -1) {
      result = 'badge badge-danger';
    } else if (status.toLowerCase().indexOf('satker') != -1) {
      result = 'badge badge-info';
    } else if (status.toLowerCase().indexOf('kanwil') != -1) {
      result = 'badge badge-primary';
    } else if (status.toLowerCase().indexOf('register') != -1) {
      result = 'badge badge-success';
    } else {
      result = 'badge badge-primary';
    }

    return result;
  }
}
