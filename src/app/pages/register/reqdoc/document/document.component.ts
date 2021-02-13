import { Component, OnInit, ViewChild, TemplateRef, Output, EventEmitter, OnDestroy, ChangeDetectorRef, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable, of, concat, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { RefService } from '../../../../@core/utils/ref.service';
import { NbToastrService, NbWindowService, NbWindowRef } from '@nebular/theme';
import { AlertService } from '../../../../@core/utils/alert.service';
import * as Globals from '../../../../globals';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter, takeUntil } from 'rxjs/operators';
import { HeaderService } from '../../../../@core/utils/header.service';
import { IdentityService } from '../../../../@core/utils/identity.service';

@Component({
  selector: 'ngx-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
})
export class DocumentComponent implements OnInit, OnDestroy {
  private sub: any;
  id: number;
  tab: any;
  kementerianLembaga: any;
  satker: any;
  selectedKl: any;
  selectedSatker: any;
  toastConfig: any = Globals.toastConfig;
  loadingDepartemen: boolean;
  loadingSatker: boolean;
  loadingProvinsi: boolean;
  loadingSave: boolean;
  loadingDelete: boolean;
  reqDoc: any = {};
  @ViewChild('alertTemplate', { static: true }) alertTemplate: TemplateRef<any>;
  @ViewChild('refTemplate', { static: true }) refTemplate: TemplateRef<any>;
  windowRef: any;
  departemenList = [];
  satkerList = [];
  lokasiList: any = [];
  letterSubject;
  tokenDecode;
  @Output() loadDocument = new EventEmitter();
  @Output() reqDocLoaded = new EventEmitter();
  unsubscribe$ = new Subject<void>();
  loadingWindowRef: boolean;
  searchRef: any;
  lokasi: any;
  selectedLokasi: any;

  constructor(private changeDetectionRef: ChangeDetectorRef, private identityService: IdentityService, private windowService: NbWindowService, private router: Router ,private alertService: AlertService, private route: ActivatedRoute, private refService: RefService, private toastService: NbToastrService, private http: HttpClient, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];
    });
    this.reqDoc = { rd_id: this.id };
    if (this.id > 0) {
        this.getReqDocById(this.id);
    } else {
        this.getListDepartemen();
        //this.getListLokasi();
    }
  }

  getReqDocById(id) {
    this.loadDocument.emit('true');
    this.http.get(Globals.apiService + `/ReqDoc/${id}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
          this.reqDoc = data.data;
          this.reqDocLoaded.emit(this.reqDoc.send_to_kanwil_yn || '');
          this.loadDocument.emit('false');
        }, err => {
        if (err.error.Message) {
          this.loadDocument.emit('false');
        } else {
          this.loadDocument.emit('false');
        }
      }, () => {
        this.getListDepartemen();
        //this.getListLokasi();
      });
  }

  getListDepartemen() {
    this.loadingDepartemen = true;
    this.refService.getListDepartemen()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.departemenList = data.data;
      if (this.reqDoc.kddept) {
        let selectedKl = this.departemenList.filter(dep => dep.id == this.reqDoc.kddept)[0];
        this.kementerianLembaga = selectedKl.value;
        //this.changeDetectionRef.detectChanges();
        this.getListSatker(selectedKl.id);
      } 
      this.loadingDepartemen = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingDepartemen = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getListSatker(kdDept: string) {
    this.loadingSatker = true;
    return this.refService.getListSatker(kdDept)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.satkerList = data.data;
      if (this.reqDoc.kdsatker) {
        let selectedSatker = this.satkerList.filter(satker => satker.id == this.reqDoc.kdsatker)[0];
        this.satker = selectedSatker.value;
      } 
      this.loadingSatker = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingSatker = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    }, () => { 
      this.changeDetectionRef.markForCheck();
      this.changeDetectionRef.detectChanges();
    })
  }

  getListLokasi() {
    this.loadingProvinsi = true;
    this.refService.getListLokasi()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.lokasiList = data.data;
      this.loadingProvinsi = false;
    }, err => {
      this.loadingProvinsi = false;
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    }, () => {
      if(this.reqDoc.cd_lokasi) {
        let selectedLokasi = this.lokasiList.filter(loc => loc.id == this.reqDoc.cd_lokasi)[0];
        this.lokasi = selectedLokasi.value;
      }
      this.changeDetectionRef.markForCheck();
      this.changeDetectionRef.detectChanges();
    })
  }

  saveReqDoc() {
    this.loadingSave = true;
    this.reqDoc.kddept = this.selectedKl?.id || this.reqDoc.kddept;
    this.reqDoc.kdsatker = this.selectedSatker?.id || this.reqDoc.kdsatker;
    //this.reqDoc.cd_lokasi = this.selectedLokasi?.id || this.reqDoc.cd_lokasi;
    if(this.reqDoc.d_req) this.reqDoc.d_req = Globals.formatDate(this.reqDoc.d_req);
    if(this.reqDoc.d_disp_dir) this.reqDoc.d_disp_dir = Globals.formatDate(this.reqDoc.d_disp_dir);
    this.reqDoc.d_letter_sign = Globals.formatDate(this.reqDoc.d_letter_sign);
    console.log(this.reqDoc);
    if (this.id == 0) {
      //this.reqDoc.loc_id = this.identityService.ud2;
      this.http.post(Globals.apiService + `/reqdoc`,this.reqDoc)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadingSave = false;
        this.reqDoc = res.data;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.router.navigate([`/pages/register/reqdoc/${this.reqDoc.rd_id}/surat`]);
      }, err => {
        this.loadingSave = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat simpan data", this.toastConfig);
      });
    }
    else{
      this.http.put(Globals.apiService + `/reqdoc/${this.id}`,this.reqDoc)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadingSave = false;
        this.reqDoc = res.data;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.router.navigate([`/pages/register/reqdoc/${this.reqDoc.rd_id}/surat`]);
      }, err => {
        this.loadingSave = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat ubah data", this.toastConfig);
      })
    }
  }

  confirmDelete() {
    this.windowRef = this.windowService.open(this.alertTemplate, { title: 'Hapus Dokumen Permintaan' });
  }

  deleteReqDoc(){
    this.loadingDelete = true;
    this.http.delete(Globals.apiService + `/reqdoc/${this.id}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: any) => {
        this.loadingDelete = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Dihapus", "Sukses", this.toastConfig);
        this.router.navigate([`/pages/register/reqdoc`]);
      }, err => {
        this.loadingSave = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat hapus data", this.toastConfig);
      });
  }

  onGetList(type) {
    switch (type) {
      case 'kl':
        let refData = [...this.departemenList];
        this.windowRef = this.windowService.open(this.refTemplate, { title: 'Kementerian/Lembaga', context: { titleModal: 'Kementerian/Lembaga', type: type, refData: refData  } })
        break;
      case 'satker':
        let refDataSatker = [...this.satkerList];
        this.windowRef = this.windowService.open(this.refTemplate, { title: 'Satker', context: { titleModal: 'Satker', type: type, refData: refDataSatker  } })
        break;
      case 'lokasi':
        let refDataLokasi = [...this.lokasiList];
        this.windowRef = this.windowService.open(this.refTemplate, { title: 'Lokasi', context: { titleModal: 'Lokasi', type: type, refData: refDataLokasi  } })
        break;
      default:
        break;
    }
  }

  searchReference(refData, type) {
    let val = this.searchRef;
    if (val && val.trim() != '') {
      return refData.filter(item => {
        return (item.id.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.value.toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      if (type == 'kl') {
        return this.departemenList;
      } else if (type == 'satker') {
        return this.satkerList;
      } else {
        return this.lokasiList;
      }
    }
  }

  selectRef(item, type) {
    switch (type) {
      case 'kl':
        this.kementerianLembaga = item.value;
        //this.reqDoc.kddept = item.id;
        this.selectedKl = item;
        this.satker = null;
        this.reqDoc.kdsatker = null;
        console.log(this.satker);
        this.getListSatker(item.id);
        break;
      case 'satker':
        this.satker = item.value;
        //this.reqDoc.kdsatker = item.id;
        this.selectedSatker = item;
        this.changeDetectionRef.markForCheck();
        this.changeDetectionRef.detectChanges();
        break;
      case 'lokasi':
        this.lokasi = item.value;
        //this.reqDoc.kdsatker = item.id;
        this.selectedLokasi = item;
        break;
      default:
        break;
    }
    console.log(item);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
