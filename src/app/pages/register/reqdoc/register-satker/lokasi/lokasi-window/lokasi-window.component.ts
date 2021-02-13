import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import * as Globals from '../../../../../../globals';
import { RefService } from '../../../../../../@core/utils/ref.service';
import { AlertService } from '../../../../../../@core/utils/alert.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-lokasi-window',
  templateUrl: './lokasi-window.component.html',
  styleUrls: ['./lokasi-window.component.scss']
})
export class LokasiWindowComponent implements OnInit, OnDestroy {
  provinsiOptions: string[];
  kabupatenKotaOptions: string[];
  filteredProvinsiOptions$: Observable<string[]>;
  filteredKabupatenKotaOptions$: Observable<string[]>;
  @Input() type: any;
  @Input() lokasi: any = {};
  lokasiList;
  kabupatenKotaList;
  toastConfig: any = Globals.toastConfig;
  selectedLokasi;
  selectedKabKota;
  loadingProvinsi: boolean;
  loadingKabKota: boolean;
  unsubscribe$ = new Subject<void>();

  constructor(private toastService: NbToastrService, private alertService: AlertService, private refService: RefService, private ref: NbDialogRef<LokasiWindowComponent>) {
  }

  ngOnInit(): void {
    this.getListLokasi();
    this.lokasi = this.lokasi || {}
    console.log(this.lokasi);
    this.selectedLokasi = this.lokasi.nmlokasi;
    this.selectedKabKota = this.lokasi.nmkabkota;
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
    })
  }

  getListKabKota(kdLokasi) {
    this.loadingKabKota = true;
    this.refService.getListKabupatenKota(kdLokasi)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.kabupatenKotaList = data.data;
      this.loadingKabKota = false;
    }, err => {
      this.loadingKabKota = false;
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    });
  }

  selectEvent(item, type) {
    switch (type) {
      case 'lokasi':
        this.selectedKabKota = null;
        this.selectedLokasi = item;
        this.lokasi.kdlokasi = this.selectedLokasi.id;
        this.lokasi.nmlokasi = this.selectedLokasi.value;
        this.getListKabKota(item.id);
        break;
      case 'kabkot':
        this.selectedKabKota = item;
        this.lokasi.kdkabkota = this.selectedKabKota.id;
        this.lokasi.nmkabkota = this.selectedKabKota.value;
        break;
      default:
        break;
    }
  }
 
  onChangeSearch(val: string, type) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log(val);
    switch (type) {
      case 'lokasi':
        this.selectedKabKota = null;
        break;
      case 'kabkot':
        break;
      default:
        break;
    }
  }
  
  // onFocused(e){
  //   // do something when input is focused
  //   console.log(e);
  // }

  cancel() {
    this.ref.close('cancel');
  }

  submit() {
    this.ref.close(this.lokasi);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
