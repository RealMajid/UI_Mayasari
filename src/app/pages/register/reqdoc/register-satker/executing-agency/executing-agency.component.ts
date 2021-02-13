import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, TemplateRef, Input } from '@angular/core';
import { NbToastrService, NbWindowService } from '@nebular/theme';
import { AlertService } from '../../../../../@core/utils/alert.service';
import * as Globals from '../../../../../globals';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { RefService } from '../../../../../@core/utils/ref.service';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-executing-agency',
  templateUrl: './executing-agency.component.html',
  styleUrls: ['./executing-agency.component.scss']
})
export class ExecutingAgencyComponent implements OnInit, OnDestroy {
  private sub: any;
  id: number;
  tab: any;
  rcId: any;
  loadingKL: boolean;
  loadingSatker: boolean;
  loadingLokasi: boolean;
  part;
  satker;
  lokasi;
  participantList;
  satkerList;
  lokasiList;
  executingAgency: any = {};
  unsubscribe$ = new Subject<void>();
  toastConfig: any = Globals.toastConfig;
  @Output() loadEA = new EventEmitter();
  @Input() registerNo: any;
  @Input() step: any;
  beginState;
  windowRef: any;
  @ViewChild('refTemplate', { static: true }) refTemplate: TemplateRef<any>;
  searchRef: any;
  selectedParticipant: any;
  selectedSatker: any;

  constructor(private windowService: NbWindowService, private http: HttpClient, private refService: RefService, private toastService: NbToastrService, private alertService: AlertService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];
      this.rcId = params["rcid"];
    });
    this.beginState = { part_id: 0, rc_id: this.rcId };
    this.executingAgency = Object.assign({}, this.beginState);
    if (this.rcId > 0) {
      this.getEA();
    } else {
      this.getListDeptParticipant();
      this.getListLokasi();
    }
  }

  getListDeptParticipant() {
    this.loadingKL = true;
    this.refService.getListDeptParticipant()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.participantList = data.data; 
      if (this.executingAgency.pa_id) {
        let selectedKl = this.participantList.filter(dep => dep.id == this.executingAgency.pa_id)[0];
        this.part = selectedKl.value;
        this.getListSatker(selectedKl.name); // name = kddept
      } 
      this.loadingKL = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingKL = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getListSatker(kdDept) {
    this.loadingSatker = true;
    return this.refService.getListSatker(kdDept)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.satkerList = data.data;
      if (this.executingAgency.kdsatker) {
        let selectedSatker = this.satkerList.filter(s => s.id == this.executingAgency.kdsatker)[0];
        this.satker = selectedSatker.value;
      } 
      this.loadingSatker = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingSatker = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getListLokasi() {
    this.loadingLokasi = true;
    this.refService.getListLokasi()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.lokasiList = data.data;
      if (this.executingAgency.kdlokasi) {
        let selectedLokasi = this.lokasiList.filter(loc => loc.id == this.executingAgency.kdlokasi)[0];
        this.lokasi = selectedLokasi.value;
      } 
      this.loadingLokasi = false;
    }, err => {
      this.loadingLokasi = false;
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getEA() {
    this.loadEA.emit('true');
    this.http.get(Globals.apiService + `/part?rc_id=${this.rcId}&cd_partyp=90`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: any) => {
      this.loadEA.emit('false');
      this.executingAgency = res.data == null ? Object.assign({}, this.beginState) : res.data;
      this.getListDeptParticipant();
      this.getListLokasi();
      console.log(res);
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastConfig.icon = Globals.ToastIcon.Close;
      this.toastConfig.pack = 'eva';
      this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
      this.loadEA.emit('false');
    })
  }
  
  selectEvent(item, type) {
    switch (type) {
      case 'part':
        this.part = item;
        this.executingAgency.pa_id = this.part.id;
        break;
      case 'satker':
        this.satker = item;
        this.executingAgency.kdsatker = this.satker.id;
        break;
      case 'lokasi':
        this.lokasi = item;
        this.executingAgency.kdlokasi = this.lokasi.id;
        break;
      default:
        break;
    }
  }
 
  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
    console.log(val);
  }
  
  onFocused(e){
    // do something when input is focused
    console.log(e);
  }

  save() {
    this.loadEA.emit('true');
    this.executingAgency.pa_id = this.selectedParticipant?.id || this.executingAgency.pa_id;
    this.executingAgency.kdsatker = this.selectedSatker?.id || this.executingAgency.kdsatker;
    console.log(this.executingAgency);
    if (this.executingAgency.part_id == 0) {
      this.executingAgency.cg_partyp = 7;
      this.executingAgency.cd_partyp = "90";
      this.http.post(Globals.apiService + '/part', this.executingAgency)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadEA.emit('false');
        this.executingAgency.part_id = res.data.part_id;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
        this.loadEA.emit('false');
      })
    } else {
      this.http.put(Globals.apiService + `/part/${this.executingAgency.part_id}`, this.executingAgency)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadEA.emit('false');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
        this.loadEA.emit('false');
      })
    }
  }

  deleteEA() {
    this.loadEA.emit('true');
    this.http.delete(Globals.apiService + `/part/${this.executingAgency.part_id}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: any) => {
      this.loadEA.emit('false');
      this.part = null;
      this.satker = null;
      this.lokasi = null;
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
      this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
      this.toastConfig.pack = 'eva';
      this.toastService.show("Data Berhasil Dihapus", "Sukses", this.toastConfig);
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastConfig.icon = Globals.ToastIcon.Close;
      this.toastConfig.pack = 'eva';
      this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
      this.loadEA.emit('false');
    })
  }

  onGetList(type) {
    switch (type) {
      case 'part':
        let refData = [...this.participantList];
        this.windowRef = this.windowService.open(this.refTemplate, { title: 'Pemberi Hibah', context: { titleModal: 'Pemberi Hibah', type: type, refData: refData  } })
        break;
      case 'satker':
        let refDataSatker = [...this.satkerList];
        this.windowRef = this.windowService.open(this.refTemplate, { title: 'Negara', context: { titleModal: 'Negara', type: type, refData: refDataSatker  } })
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
      if (type == 'part') {
        return this.participantList;
      } else {
        return this.satkerList;
      }
    }
  }

  selectRef(item, type) {
    switch (type) {
      case 'part':
        this.selectedParticipant = item;
        this.part = item.value;
        this.executingAgency.kdsatker = null;
        this.executingAgency.kdlokasi = null;
        this.lokasi = null;
        this.satker = null;
        this.getListSatker(item.name); // name = kddept
        break;
      case 'satker':
        this.selectedSatker = item;
        this.satker = item.value;
        this.executingAgency.kdlokasi = item.name; // name = kdlokasi
        let selectedLokasi = this.lokasiList.filter(loc => loc.id == this.executingAgency.kdlokasi)[0];
        this.lokasi = selectedLokasi.value;
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
