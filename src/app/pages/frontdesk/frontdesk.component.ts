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
import { RefService } from '../../@core/utils/ref.service';
declare var $: any;

@Component({
  selector: 'ngx-frontdesk',
  templateUrl: './frontdesk.component.html',
  styleUrls: ['./frontdesk.component.scss']
})
export class FrontdeskComponent implements OnInit {

  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;

  registerKasusList$: Observable<any[]>;
  pasienList: any = [];
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
  registerKasus: any = {};
  loadingModal: boolean;
  jenisKelamin: any;
  klinikList: any;
  search: any = "";
  sort: any = ""  ;
  jenisPasien: any;

  constructor(private refService: RefService, private alertService: AlertService, private windowService: NbWindowService, protected dateService: NbDateService<Date>, private headerService: HeaderService, private router: Router, private route: ActivatedRoute, private http: HttpClient, public toastService: NbToastrService,) {
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
    this.getRegisterKasusList(1);
    this.getListKlinik();
  }

  registerPasien() {
    this.registerKasus = {};
    this.jenisPasien = null;
  }

  onSelectJenisPasien(jenis) {
    this.registerKasus.JenisPasien = jenis;
    if (jenis == '2') this.getPasienList();
  }

  onSelectPasien(idPasien) {
    let pasien = this.pasienList.filter(x => x.ID_PASIEN == idPasien)[0];
    console.log(idPasien, pasien);
    this.registerKasus.Nama = pasien.NAMA;
    this.registerKasus.Alamat = pasien.ALAMAT;
    this.registerKasus.TempatLahir = pasien.TEMPAT_LAHIR;
    this.registerKasus.Email = pasien.EMAIL;
    this.registerKasus.Telp = pasien.TELP;
    this.registerKasus.JenisKelamin = pasien.JENIS_KELAMIN;
    this.registerKasus.TglLahir = Globals.formatDate(new Date(pasien.TGL_LAHIR));
  }

  getPasienList() {
    this.loadingModal = true;
    this.http.get(Globals.apiService + `/pasien/list`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.pasienList = data;
      this.loadingModal = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingModal = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getInfoPasien(regNo: any) {
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

  admisiKasus(regNo: any) {
    this.http.put(Globals.apiService + `/admisikasus?regNo=${regNo}`, this.registerKasus)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadingModal = false;
        $('#modalRegisterPasien').modal('hide');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Kasus Berhasil di Admisi", "Sukses", this.toastConfig);
        this.getRegisterKasusList(1);
      }, err => {
        this.loadingModal = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat simpan data", this.toastConfig);
      });
  }

  getStatusStyle(status: string) {
    let result;

    if (status.toLowerCase().indexOf('queuing') != -1) {
      result = 'badge badge-info';
    } else if (status.toLowerCase().indexOf('checkup') != -1) {
      result = 'badge badge-success';
    } else if (status.toLowerCase().indexOf('closed') != -1) {
      result = 'badge badge-danger';
    } else {
      result = 'badge badge-primary';
    }

    return result;
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

  onRangeChange(event) {
    this.rangeDate = event;
    let end;
    if (event.end) end = this.dateService.addDay(<Date>event.end, 1);

    this.dFrom = Globals.formatDate(event.start || this.monthStart);
    this.dTo = Globals.formatDate(end || this.monthEnd);

    console.log(this.dFrom, this.dTo);
  }

  onRefresh() {
    this.getRegisterKasusList(this.pageNumber);
  }

  saveRegisterPasien() {
    this.loadingModal = true;
    if(this.registerKasus.TglLahir) this.registerKasus.TglLahir = Globals.formatDate(this.registerKasus.TglLahir);
    console.log(this.registerKasus);
    if (!this.registerKasus.RegNo) {
      this.http.post(Globals.apiService + `/RegisterKasus`,this.registerKasus)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadingModal = false;
        $('#modalRegisterPasien').modal('hide');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.getRegisterKasusList(1);
      }, err => {
        this.loadingModal = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat simpan data", this.toastConfig);
      });
    } else {
      this.http.put(Globals.apiService + `/RegisterKasus?regNo=${this.registerKasus.RegNo}`,this.registerKasus)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadingModal = false;
        $('#modalRegisterPasien').modal('hide');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.getRegisterKasusList(1);
      }, err => {
        this.loadingModal = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat simpan data", this.toastConfig);
      });
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
