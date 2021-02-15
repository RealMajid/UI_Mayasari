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
declare var $: any;

@Component({
  selector: 'ngx-hubungi-dokter',
  templateUrl: './hubungi-dokter.component.html',
  styleUrls: ['./hubungi-dokter.component.scss']
})
export class HubungiDokterComponent implements OnInit {

  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;

  penjadwalanList$: Observable<any[]>;
  pasienList: any = [];
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
  registerKasus: any = {};
  loadingModal: boolean;
  jenisKelamin: any;
  klinikList: any;
  search: any = "";
  sort: any = ""  ;
  jenisPasien: any;
  penjadwalan: any = {};
  private sub: any;
  id: number;
  tab: any;

  constructor(private refService: RefService, private alertService: AlertService, private router: Router, private route: ActivatedRoute, private http: HttpClient, public toastService: NbToastrService,) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];
    });
    this.getPenjadwalanList(this.pageNumber);
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

  newAppointment() {
    this.penjadwalan = {IdJadwal: 0, IdPemeriksaan: this.id};
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

  editPenjadwalan(idJadwal: any) {
    this.loadingModal = true;
    this.http.get(Globals.apiService + `/jadwal?idJadwal=${idJadwal}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.penjadwalan = data;
      this.penjadwalan.TglPerjanjian = Globals.formatDate(new Date(this.penjadwalan.TglMulai));
      this.penjadwalan.JamMulai = Globals.getTimeFromISODateString(this.penjadwalan.TglMulai); 
      this.penjadwalan.JamSelesai = Globals.getTimeFromISODateString(this.penjadwalan.TglSelesai); 
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

  getPenjadwalanList(pageNumber: number) {
    this.loading = true;
    let pagedList: any = {};
    let urlAPI = this.id > 0 ? `/jadwal?search=${this.search}&sort=${this.sort}&idPemeriksaan=${this.id}&limit=${this.pageSize}&offset=${pageNumber}` :
    `/jadwal/listrecent?search=${this.search}&sort=${this.sort}&limit=${this.pageSize}&offset=${pageNumber}`;
    this.http.get(Globals.apiService + urlAPI)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.pageNumber = pageNumber;
        pagedList.TotalPage = Math.ceil(data.TotalRecord / this.pageSize);
        console.log(data);
        this.penjadwalanList$ = of(data.Data);
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

  saveHubungiDokter() {
    this.loadingModal = true;
    console.log(this.penjadwalan)
    let tglAppointmentMulai = new Date(this.penjadwalan.TglPerjanjian);
    let tglAppointmentSelesai = new Date(this.penjadwalan.TglPerjanjian);
    let waktuMulai = (this.penjadwalan.JamMulai as string).split(":");
    let waktuSelesai = (this.penjadwalan.JamSelesai as string).split(":");
    let jamMulai = parseInt(waktuMulai[0]);
    let menitMulai = parseInt(waktuMulai[1]);
    let jamSelesai = parseInt(waktuSelesai[0]);
    let menitSelesai = parseInt(waktuSelesai[1]);

    tglAppointmentMulai.setHours(jamMulai);
    tglAppointmentMulai.setMinutes(menitMulai);

    tglAppointmentSelesai.setHours(jamSelesai);
    tglAppointmentSelesai.setMinutes(menitSelesai);
    this.penjadwalan.TglMulai = Globals.formatDateTime(tglAppointmentMulai);
    this.penjadwalan.TglSelesai = Globals.formatDateTime(tglAppointmentSelesai);
    let urlAPI = this.id > 0 ? `/jadwal` : `/jadwal/recent`;
    if (!this.registerKasus.IdJadwal) {
      this.http.post(Globals.apiService + urlAPI,this.penjadwalan)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadingModal = false;
        $('#modalHubungiDokter').modal('hide');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.getPenjadwalanList(1);
      }, err => {
        this.loadingModal = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat simpan data", this.toastConfig);
      });
    } else {
      this.http.put(Globals.apiService + `/jadwal?idJadwal=${this.penjadwalan.IdJadwal}`,this.penjadwalan)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadingModal = false;
        $('#modalHubungiDokter').modal('hide');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.getPenjadwalanList(1);
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
