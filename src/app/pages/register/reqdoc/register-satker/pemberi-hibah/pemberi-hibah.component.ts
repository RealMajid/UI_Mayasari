import { Component, OnInit, Output, EventEmitter, OnDestroy, ViewChild, TemplateRef, Input, ChangeDetectorRef } from '@angular/core';
import { NbToastrService, NbWindowService } from '@nebular/theme';
import { AlertService } from '../../../../../@core/utils/alert.service';
import * as Globals from '../../../../../globals';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { RefService } from '../../../../../@core/utils/ref.service';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-pemberi-hibah',
  templateUrl: './pemberi-hibah.component.html',
  styleUrls: ['./pemberi-hibah.component.scss']
})
export class PemberiHibahComponent implements OnInit, OnDestroy {

  // Donor
  private sub: any;
  cyMultilateral = ['AB','IB','IF', 'I1', 'I2','IO'];
  cyBilateral = ['AB','IB','IF', 'I1', 'I2','IO','ID'];
  cyID = ['ID'];
  id: number;
  tab: any;
  rcId: any;
  loadingNegara: boolean;
  loadingDonor: boolean;
  country;
  donor;
  cd_fin_sour;
  donorList = [];
  donorListAll;
  negaraList;
  categorizedNegaraList = [];
  sumberPembiayaanList = [];
  pemberihibah: any = {};
  unsubscribe$ = new Subject<void>();
  toastConfig: any = Globals.toastConfig;
  @Output() loadPH = new EventEmitter();
  @Input() registerNo: any;
  @Input() step: any;
  beginState;
  windowRef: any;
  @ViewChild('refTemplate', { static: true }) refTemplate: TemplateRef<any>;
  searchRef: any;
  selectedDonor: any;
  selectedCountry: any;
  selectedSumberPembiayaan: any;
  isPembatalan: boolean;
  isInputManual: boolean;


  constructor(private changeDetectorRef: ChangeDetectorRef,private windowService: NbWindowService, private http: HttpClient, private refService: RefService, private toastService: NbToastrService, private alertService: AlertService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];
      this.rcId = params["rcid"];
    });
    this.beginState = { part_id: 0, rc_id: this.rcId };
    this.pemberihibah = Object.assign({},this.beginState);
    if (this.rcId > 0) {
      this.getPemberiHibah();
    } else {
      this.getListSumberPembiayaan();
      this.getNegara();
    }
  }

  getListSumberPembiayaan() {
    this.loadingDonor = true;
    this.refService.getListSumberPembiayaan()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.sumberPembiayaanList = data.data;
      if (this.pemberihibah.cd_fin_sour) {
        let selectedFinSour = this.sumberPembiayaanList.filter(fs => fs.id == this.pemberihibah.cd_fin_sour)[0];
        this.cd_fin_sour = selectedFinSour.value;
        this.getListPemberiHibah(selectedFinSour.id);
      } 
      console.log(this.sumberPembiayaanList);
      this.loadingDonor = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingDonor = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getListPemberiHibah(cd_parent) {
    this.loadingDonor = true;
    this.refService.getListPemberiHibah(cd_parent)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.donorList = data.data;
      if (this.pemberihibah.pa_id) {
        let selectedKl = this.donorList.filter(dep => dep.id == this.pemberihibah.pa_id)[0];
        this.donor = selectedKl.value;
      } 
      this.loadingDonor = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingDonor = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getListParticipant() {
    this.loadingDonor = true;
    this.refService.getListParticipant()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.donorListAll = data.data;
      this.donorList = this.donorListAll.slice(0, 10);
      if (this.pemberihibah.pa_id) {
        let selectedKl = this.donorListAll.filter(dep => dep.id == this.pemberihibah.pa_id)[0];
        this.donor = selectedKl.value;
      } 
      this.loadingDonor = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingDonor = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getNegara() {
    this.loadingNegara = true;
    this.refService.getListNegara()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.negaraList = data.data;
      if (this.pemberihibah.cd_country) {
        let selectedCountry = this.negaraList.filter(cy => cy.id == this.pemberihibah.cd_country)[0];
        this.country = selectedCountry.value;
      } 
      console.log(data);
      this.loadingNegara = false;
    }, err => {
      this.loadingNegara = false;
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastConfig.icon = Globals.ToastIcon.Close;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  
  getPemberiHibah() {
    this.loadPH.emit('true');
    this.http.get(Globals.apiService + `/part?rc_id=${this.rcId}&cd_partyp=${20}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: any) => {
      this.loadPH.emit('false');
      this.pemberihibah = res.data == null ? Object.assign({}, this.beginState) : res.data;
      this.getListSumberPembiayaan();
      this.getNegara();
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastConfig.icon = Globals.ToastIcon.Close;
      this.toastConfig.pack = 'eva';
      this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
      this.loadPH.emit('false');
    })
  }
  
  selectEvent(item, type) {
    switch (type) {
      case 'donor':
        this.donor = item;
        this.pemberihibah.pa_id = this.donor.id;
        break;
      case 'country':
        this.country = item;
        this.pemberihibah.cd_country = this.country.id;
        console.log(this.country);
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
    this.loadPH.emit('true');
    this.pemberihibah.cd_fin_sour = this.selectedSumberPembiayaan?.id || this.pemberihibah.cd_fin_sour;
    this.pemberihibah.pa_id = this.selectedDonor?.id || this.pemberihibah.pa_id;
    this.pemberihibah.cd_country = this.selectedCountry?.id || this.pemberihibah.cd_country;
    console.log(this.pemberihibah);
    if (this.pemberihibah.part_id == 0) {
      this.pemberihibah.cg_partyp = 7;
      this.pemberihibah.cd_partyp = "20";
      this.http.post(Globals.apiService + '/part', this.pemberihibah)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadPH.emit('false');
        this.pemberihibah.part_id = res.data.part_id;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
        this.loadPH.emit('false');
      })
    } else {
      this.http.put(Globals.apiService + `/part/${this.pemberihibah.part_id}`, this.pemberihibah)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadPH.emit('false');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
        this.loadPH.emit('false');
      })
    }
  }

  deletePemberiHibah() {
    this.loadPH.emit('true');
    this.http.delete(Globals.apiService + `/part/${this.pemberihibah.part_id}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: any) => {
      this.loadPH.emit('false');
      this.cd_fin_sour = null;
      this.donor = null;
      this.country = null;
      this.getPemberiHibah();
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
      this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
      this.toastConfig.pack = 'eva';
      this.toastService.show("Data Berhasil Dihapus", "Sukses", this.toastConfig);
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastConfig.icon = Globals.ToastIcon.Close;
      this.toastConfig.pack = 'eva';
      this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
      this.loadPH.emit('false');
    })
  }

  onGetList(type) {
    switch (type) {
      case 'finsour':
        let refDataFinSour = [...this.sumberPembiayaanList];
        this.windowRef = this.windowService.open(this.refTemplate, { title: 'Sumber Pembiayaan', context: { titleModal: 'Sumber Pembiayaan', type: type, refData: refDataFinSour  } });
        break;
      case 'donor':
        let refData = [...this.donorList];
        this.windowRef = this.windowService.open(this.refTemplate, { title: 'Pemberi Hibah', context: { titleModal: 'Pemberi Hibah', type: type, refData: refData  } })
        break;
      case 'country':
        let refDataCountry = [...this.categorizedNegaraList];
        this.windowRef = this.windowService.open(this.refTemplate, { title: 'Negara', context: { titleModal: 'Negara', type: type, refData: refDataCountry  } });
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
      if (type == 'donor') {
        return this.donorList;
      } else if (type == 'finsour') {
        return this.sumberPembiayaanList;
      } else {
        return this.categorizedNegaraList;
      }
    }
  }

  selectRef(item, type) {
    switch (type) {
      case 'donor':
        this.selectedDonor = item;
        this.donor = item.value;
        break;
      case 'country':
        this.selectedCountry = item;
        this.country = item.value;
        break;
      case 'finsour':
        this.selectedSumberPembiayaan = item;
        this.cd_fin_sour = item.value;
        this.pemberihibah.pa_id = null;
        this.donor = null;
        this.pemberihibah.cd_country;
        this.categorizedNegaraList = [];
        this.country = null;
        this.isInputManual = false;
        this.getListPemberiHibah(this.selectedSumberPembiayaan.id);
        switch (this.selectedSumberPembiayaan.id) {
          case '1':
            this.categorizedNegaraList = this.negaraList.filter(cy => this.cyMultilateral.indexOf(cy.id) != -1);
            break;
          case '2':
            this.categorizedNegaraList = this.negaraList.filter(cy => this.cyBilateral.indexOf(cy.id) == -1);
            break;
          default:
            this.categorizedNegaraList = this.negaraList.filter(cy => this.cyID.indexOf(cy.id) != -1);
            this.selectedCountry = this.categorizedNegaraList[0];
            this.country = this.categorizedNegaraList[0].value;
            break;
        }
        break;
      default:
        break;
    }
    console.log(item);
  }

  toggleCheckBox(isInputManual: boolean) {
    this.isInputManual = isInputManual;

    if (isInputManual) {
      let defaultValue; // default value ketika pilih input manual, diisi CD_CODE dari CG_NO = 5
      switch (this.selectedSumberPembiayaan.id) {
        case '1':
          defaultValue = '100'
          break;
        case '2':
          defaultValue = '101'
          break;
        case '3':
          defaultValue = '300'
          break;
        case '4':
          defaultValue = '310'
          break;
        case '5':
          defaultValue = '230'
          break;
        case '6':
          defaultValue = '400'
          break;
        case '7':
          defaultValue = '250'
          break;
        case '8':
          defaultValue = '250'
          break;
        case '9':
          defaultValue = '391'
          break;
        default:
          break;
      }
      this.selectedDonor = this.donorList.filter(x => x.id == defaultValue)[0];
      this.donor = this.selectedDonor.value;
    } else {
      this.selectedDonor = null;
      this.donor = null;
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
