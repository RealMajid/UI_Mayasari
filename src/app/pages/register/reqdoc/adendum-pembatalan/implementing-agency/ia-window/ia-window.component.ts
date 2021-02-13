import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { Observable, of, Subject } from 'rxjs';
import { AlertService } from '../../../../../../@core/utils/alert.service';
import { RefService } from '../../../../../../@core/utils/ref.service';
import * as Globals from '../../../../../../globals';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'ngx-ia-window',
  templateUrl: './ia-window.component.html',
  styleUrls: ['./ia-window.component.scss']
})
export class IaWindowComponent implements OnInit, OnDestroy {
  participantList: any[];
  participantListAll: any[];
  satkerList: any[];
  satkerListAll: any[];
  selectedKL: any;
  selectedSatker: any;
  @Input() type: any;
  @Input() implementingAgency: any = {};
  loadingKL:boolean;
  loadingSatker:boolean;
  toastConfig: any = Globals.toastConfig;
  unsubscribe$ = new Subject<void>();

  constructor(private toastService: NbToastrService, private alertService: AlertService, private refService: RefService, private ref: NbDialogRef<IaWindowComponent>) {
  }

  ngOnInit(): void {
    this.implementingAgency = this.implementingAgency || {}
    console.log(this.implementingAgency);
    this.getListParticipant();
    this.getListSatker();
    this.selectedKL = this.implementingAgency.name_part;
    this.selectedSatker = this.implementingAgency.nmsatker;
  }

  getListParticipant() {
    this.loadingKL = true;
    this.refService.getListParticipant()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.participantListAll = data.data;
      this.participantList = this.participantListAll.slice(0, 10);
      //this.participantList = data.data;
      // if (this.reqDoc.kddept) {
      //   let selectedKl = this.departemenList.filter(dep => dep.id == this.reqDoc.kddept)[0];
      //   this.kementerianLembaga = selectedKl.value;
      //   this.getListSatker(selectedKl.id);
      // } 
      this.loadingKL = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingKL = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getListSatker() {
    this.loadingSatker = true;
    return this.refService.getListAllSatker()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.satkerListAll = data.data;
      this.satkerList = this.satkerListAll.slice(0, 10);
      // if (this.reqDoc.kdsatker) {
      //   let selectedSatker = this.satkerList.filter(satker => satker.id == this.reqDoc.kdsatker)[0];
      //   this.satker = selectedSatker.value;
      // } 
      this.loadingSatker = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingSatker = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  selectEvent(item, type) {
    switch (type) {
      case 'part':
        this.selectedKL = item;
        this.implementingAgency.pa_id = this.selectedKL.id;
        this.implementingAgency.part_name = this.selectedKL.value;
        break;
      case 'satker':
        this.selectedSatker = item;
        this.implementingAgency.kdsatker = this.selectedSatker.id;
        this.implementingAgency.nmsatker = this.selectedSatker.value;
        break;
      default:
        break;
    }
  }

  onChangeSearch(event, type) {
    switch (type) {
      case 'part':
        this.selectedKL = event;
        // let filteredKL = this.participantListAll.filter(part => {part.value.includes(event)});
        // this.participantList = filteredKL.length > 10 ? filteredKL.splice(0, 10) : filteredKL;
        // this.participantList = null;        
        // this.participantList = filteredKL;
        console.log(event, type);
        break;
      case 'satker':
        this.selectedSatker = event;
        break;
      default:
        break;
    }
  }

  onGetPartList() {
    console.log('test');
  }

  cancel() {
    this.ref.close('cancel');
  }

  submit() {
    console.log(this.implementingAgency);
    this.ref.close(this.implementingAgency);
  }
  
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
