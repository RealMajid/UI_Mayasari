import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import * as Globals from '../../../../../globals';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { PaginationComponent } from '../../../../../@theme/components/pagination/pagination.component';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { NbToastrService } from '@nebular/theme';
import { AlertService } from '../../../../../@core/utils/alert.service';

@Component({
  selector: 'ngx-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;
  @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef;
  @Output() loadSummary = new EventEmitter();
  @Input() registerNo: any;
  implementingAgencyList$: Observable<any[]>;
  implementingAgency: any;
  pageNumber = 1;
  pageSize = 5;
  unsubscribe$ = new Subject<void>();
  toastConfig: any = Globals.toastConfig;
  sub: any;
  id: any;
  tab: any;
  rcId: any;
  sort: any = '';
  summaryHibah: any = {};
  implementingAgencies: any = [];
  rencanaPenarikan: any = [];
  lokasiProyek: any = [];
  donor: any = {};

  constructor(private http: HttpClient, private route: ActivatedRoute, private toastService: NbToastrService, private alertService: AlertService) {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];
      this.rcId = params["rcid"];
    });
  }

  ngOnInit(): void {
    this.getRptRingkasanHibah();
  }

  getRptRingkasanHibah() {
    this.loadSummary.emit('true');
    this.http.get(Globals.apiService + `/report/summaryhibah/${this.rcId}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data: any) => {
      this.summaryHibah = data.data;
      this.implementingAgencies = this.summaryHibah.implementing_agencies || [];
      this.donor = this.summaryHibah.donor || {};
      this.rencanaPenarikan = this.summaryHibah.rencana_penarikan || [];
      this.lokasiProyek = this.summaryHibah.lokasi_proyek || [];
      console.log(this.summaryHibah);
      this.loadSummary.emit('false');
    }, err => {
      this.loadSummary.emit('true');
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  public captureScreen() {
    this.loadSummary.emit('true');

    var data = document.getElementById('pdfTable');
    html2canvas(data).then(canvas => {
      // Few necessary setting options  
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      let fileName = `RingkasanHibah.pdf`;

      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF  
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
      pdf.save(fileName); // Generated PDF   
      this.loadSummary.emit('false');
    });
  }

  public downloadAsPDF() {
    const doc = new jsPDF();

    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    const pdfTable = this.pdfTable.nativeElement;

    doc.addHTML(pdfTable.innerHTML, 15, 15, {
      width: 190,
      'elementHandlers': specialElementHandlers
    }
    , function () {
      const blob = doc.output('blob');
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(blob);
      } else {
        window.open(URL.createObjectURL(blob));
      }
    }
    );

    // pdf.addHTML(this.pdfPage.nativeElement, 0, 0, { pagesplit: true }, function () {
    //         const blob = doc.output('blob');
    //         if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    //           window.navigator.msSaveOrOpenBlob(blob);
    //         } else {
    //           window.open(URL.createObjectURL(blob));
    //         }
    //       });

    //doc.save('tableToPdf.pdf');
  }

}
