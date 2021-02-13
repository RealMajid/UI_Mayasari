import { Component, OnInit, ViewChild, TemplateRef, OnDestroy, ChangeDetectorRef, AfterViewInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Observable, of, Subject } from 'rxjs';
import { RefService } from '../../../../../@core/utils/ref.service';
import { NbDateService, NbSelectComponent, NbToastrService, NbWindowService } from '@nebular/theme';
import { AlertService } from '../../../../../@core/utils/alert.service';
import * as Globals from '../../../../../globals';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { CdsService } from '../../../../../@core/utils/cds.service';
import { IdentityService } from '../../../../../@core/utils/identity.service';

@Component({
  selector: "ngx-register-satker-detail",
  templateUrl: "./register-satker-detail.component.html",
  styleUrls: ["./register-satker-detail.component.scss"],
})
export class RegisterSatkerDetailComponent implements OnInit, OnDestroy {
  private sub: any;
  id: number;
  tab: any;
  rcId: any;
  step: any;
  currency = "IDR";
  sumberHibah = "1";
  jenisHibah = "1";
  bentukHibah: any;
  jenisBarang: any;
  sektorEkonomi: any;
  sumberPembiayaan: any;
  caraTarik: any;
  pemberiHibah:any;
  negara: any;
  kementerianLembaga: any;
  satker: any;
  provinsi: any;
  toastConfig: any = Globals.toastConfig;
  value: string;
  loadingNph: boolean;
  currencies;
  bentukHibahList;
  sektorEkonomiList;
  sumberPembiayaanList: any;
  jenisPembiayaanList: any = [];
  jenisPembiayaanKasList: any = [];
  jenisPembiayaanBarangList: any = [];
  jenisPembiayaanJasaList: any = [];
  register: any = {};
  registerNo: any = "";
  @ViewChild('alertTemplate', { static: true }) alertTemplate: TemplateRef<any>;
  @ViewChild('refTemplate', { static: true }) refTemplate: TemplateRef<any>;
  @ViewChild('multipleSelect', { static: true }) multipleSelect: NbSelectComponent;
  windowRef: any;
  cd_ud5 = [];
  cd_econsect: any;
  cd_fin_sour: any;
  selectedBentukHibah: any;
  loadingLokasi: boolean;
  loadingSummary: boolean;
  unsubscribe$ = new Subject<void>();
  searchRef: any;
  selectedSektorEkonomi: any;
  selectedSumberPembiayaan: any;
  minDClosingAccount: Date;
  registerFinancingTypes: any;
  registerFinancingTypesMultiple: any = [];
  isMultiple: boolean;
  showJenisPembiayaan: boolean;

  constructor(private identityService: IdentityService, private dateService: NbDateService<Date>, private changeDetectionRef: ChangeDetectorRef, private router: Router, private http: HttpClient, private windowService: NbWindowService, private refService: RefService, private cdsService: CdsService, private toastService: NbToastrService, private alertService: AlertService, private route: ActivatedRoute) {
    this.minDClosingAccount = this.dateService.today();
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];
      this.rcId = +params["rcid"];
    });

    this.register.rd_id = this.id;
    this.register.rc_id = this.rcId;
    this.getRefRegister();
    this.getJenisPembiayaan();
  }

  onChangeTab($event) {
    let nameTab = $event.tabTitle.toLowerCase();
    console.log($event);
  }

  getRefRegister() {
    this.loadingNph = true;
    this.refService.getRefRegister()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.currencies = data.data.currency;
      if (this.register.rc_id == 0) {
        this.register.cu_base = "IDR";
        //this.register.cd_ud1 = this.identityService.groupId == '1' ? '2' : '8'; // Jika groupid = admin maka default hibah terencana, else hibah langsung
        //this.register.cd_ud2 = '2';
        this.register.cara_tarik = '2';
        this.register.step = 1;
        this.step = 1;
      };
      this.bentukHibahList = data.data.bentukhibah;
      this.sektorEkonomiList = data.data.sektorekonomi;
      this.sumberPembiayaanList = data.data.sumberpembiayaan;
      if (this.rcId > 0) this.getRegister();
      this.loadingNph = false;
    }, err => {
      this.loadingNph = false;
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastConfig.icon = Globals.ToastIcon.Close;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getJenisPembiayaan() {
    this.loadingNph = true;
    this.cdsService.getJenisPembiayaanList()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.jenisPembiayaanList = data.data;
      this.jenisPembiayaanKasList = data.data.filter(jp => jp.ud1 == '1');
      this.jenisPembiayaanBarangList = data.data.filter(jp => jp.ud1 == '2');
      this.jenisPembiayaanJasaList = data.data.filter(jp => jp.ud1 == '3');
      this.loadingNph = false;
    }, err => {
      this.loadingNph = false;
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastConfig.icon = Globals.ToastIcon.Close;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getRegister() {
    this.loadingNph = true;
    this.http.get(Globals.apiService + `/register/${this.rcId}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: any) => {
      this.loadingNph = false;
      this.register = res.data;
      this.registerNo = res.data.register_no;
      this.step = this.register.step;
      this.register.d_sign = new Date(this.register.d_sign);
      this.register.d_draw_lim = new Date(this.register.d_draw_lim);
      this.register.d_closing_account = new Date(this.register.d_closing_account);
      // this.register.cu_base = this.currencies.filter(cur => cur.id == this.register.cu_base);
      // this.register.cd_econsect = this.sektorEkonomiList.filter(se => se.id == this.register.cd_econsect);
      // this.register.cd_fin_sour = this.sumberPembiayaanList.filter(sp => sp.id == this.register.cd_fin_sour);
      this.bentukHibah = this.register.cd_ud5;
      if (this.register.cd_ud5=='8'||this.register.cd_ud5=='5'||this.register.cd_ud5=='6'||this.register.cd_ud5=='7') this.isMultiple = true;
      this.mapFinTypeReverse(this.register.register_financing_types)
      this.cd_econsect = this.register.econsect;
      this.cd_fin_sour = this.register.fin_sour;
      //this.assignBentukHibahReverse(this.register);
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastConfig.icon = Globals.ToastIcon.Close;
      this.toastConfig.pack = 'eva';
      this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
      this.loadingNph = false;
    })
  }

  onLoadLokasi(event) {
    this.loadingLokasi = event == 'true' ? true : false;
    this.changeDetectionRef.detectChanges();
  }

  onLoadSummary(event) {
    this.loadingSummary = event == 'true' ? true : false;
    this.changeDetectionRef.detectChanges();
  }

  selectEvent(item, type) {
    switch (type) {
      case 'econsect':
        this.cd_econsect = item;
        this.register.cd_econsect = this.cd_econsect.id;
        break;
      case 'finsour':
        this.cd_fin_sour = item;
        this.register.cd_fin_sour = this.cd_fin_sour.id;
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

  onDDrawLimChange(value) {
    if(this.register.d_closing_account && (this.register.d_closing_account < this.register.d_draw_lim)) {
      this.register.d_closing_account = this.register.d_draw_lim;
    }
    this.minDClosingAccount = value;
  }

  onBentukHibahChange() {
    this.register.cd_ud5 = null;
    this.changeDetectionRef.detectChanges();
    // this.jenisPembiayaanKasList = [];
    // this.jenisPembiayaanBarangList = [];
    // this.jenisPembiayaanJasaList = [];
    // this.jenisPembiayaanKasList = this.jenisPembiayaanList.filter(jp => jp.ud1 == '1');
    // this.jenisPembiayaanBarangList = this.jenisPembiayaanList.filter(jp => jp.ud1 == '2');
    // this.jenisPembiayaanJasaList = this.jenisPembiayaanList.filter(jp => jp.ud1 == '3');

    this.register.cd_ud5 = this.bentukHibah;
    if (this.register.cd_ud5=='8'||this.register.cd_ud5=='5'||this.register.cd_ud5=='6'||this.register.cd_ud5=='7') {
      this.isMultiple = true;
    } else {
      this.isMultiple = false;
    }

    if (this.isMultiple) {
      this.registerFinancingTypesMultiple = [];
    } else {
      this.registerFinancingTypes = null;
    }

    if (this.register.cd_ud5=='1'||this.register.cd_ud5=='2'||this.register.cd_ud5=='4'||this.register.cd_ud5=='6') {
      this.register.d_closing_account = null;
    } else {
      if (this.register.d_draw_lim) {
        this.minDClosingAccount = this.register.d_draw_lim;
        this.register.d_closing_account = this.register.d_draw_lim;
      } else {
        this.minDClosingAccount = this.dateService.today();
        this.register.d_closing_account = this.dateService.today();
      }
    }
    // if (this.register.cd_ud5=='1'||this.register.cd_ud5=='5'||this.register.cd_ud5=='6'||this.register.cd_ud5=='7') {
    //   this.register.cd_jenis_barang = this.register.cd_jenis_barang;
    // } else {
    //   this.register.cd_jenis_barang = null;
    // }
  }

  onFinTypeChange(data) {
    this.registerFinancingTypes = data;
    console.log(this.registerFinancingTypes);
  }

  onFinTypeChangeMultiple(data) {
    this.registerFinancingTypesMultiple = data;
    console.log(this.registerFinancingTypesMultiple);
  }

  mapFinType() {
    let register_financing_types: any[] = [];

    if (this.isMultiple) {
      console.log(this.registerFinancingTypesMultiple)
      register_financing_types = this.registerFinancingTypesMultiple.map((rft, index) => {
        console.log(rft)
        // if (!this.register.register_financing_types) {
        //   register_fin_type.rft_id = 0;
        //   register_fin_type.rc_id = this.rcId;
        //   register_fin_type.cg_fin_typ = rft.cg_no;
        //   register_fin_type.cd_fin_typ = rft.cd_code;
        //   register_fin_type.cd_grant_grp = rft.ud1;
        // } else {
        let register_fin_type: any = {};
        register_fin_type.rft_id = this.register.register_financing_types && this.register.register_financing_types[index] ? this.register.register_financing_types[index].rft_id : 0;
        register_fin_type.rc_id = this.rcId;
        register_fin_type.cg_fin_typ = rft.cg_no;
        register_fin_type.cd_fin_typ = rft.cd_code;
        register_fin_type.cd_grant_grp = rft.ud1;
        //}
        return register_fin_type;
      });
    } else {
        let register_fin_type: any = {};
        register_fin_type.rft_id = this.register.register_financing_types && this.register.register_financing_types[0] ? this.register.register_financing_types[0].rft_id : 0;
        register_fin_type.rc_id = this.rcId;
        register_fin_type.cg_fin_typ = this.registerFinancingTypes.cg_no;
        register_fin_type.cd_fin_typ = this.registerFinancingTypes.cd_code;
        register_fin_type.cd_grant_grp = this.registerFinancingTypes.ud1;
        register_financing_types = [register_fin_type];
    }
    console.log(register_financing_types);
    return register_financing_types;
  }

  mapFinTypeReverse(data: any) {
    let arrayResult: any[] = [];
    data.forEach(elData => {
      arrayResult.push(...(this.jenisPembiayaanList.filter(elListItem => elListItem.cd_code == elData.cd_fin_typ)));
    });
    console.log(arrayResult);
    if (this.isMultiple) {
      this.registerFinancingTypesMultiple = [...arrayResult];
      this.changeDetectionRef.detectChanges();
    } else {
      this.registerFinancingTypes = arrayResult[0];
    }
  }

  save() {
    this.loadingNph = true;
    //this.assignBentukHibah(this.selectedBentukHibah);
    this.register.d_sign = Globals.formatDate(this.register.d_sign);
    this.register.d_draw_lim = Globals.formatDate(this.register.d_draw_lim);
    if (this.register.d_closing_account) this.register.d_closing_account = Globals.formatDate(this.register.d_closing_account);
    this.register.cu_base = this.register.cu_base.id || this.currency;
    this.register.cd_econsect = this.selectedSektorEkonomi?.id || this.register.cd_econsect;
    this.register.cd_fin_sour = this.selectedSumberPembiayaan?.id || this.register.cd_fin_sour;
    this.register.register_financing_types = this.mapFinType();
    this.register.status_id = 0;
    if (this.rcId == 0) {
      //this.register.PART_CSOS = [{ PART_ID: 0, CD_PARTYP: "20", PA_ID: this.register.DONOR_ID }];
      this.register.step = 1;
      this.register.status_register = 1;
      this.http.post(Globals.apiService + '/register', this.register)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        let _register = res.data;
        this.loadingNph = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.router.navigate([`/pages/register/reqdoc/${_register.rd_id}/register/${_register.rc_id}`]);
      }, err => {
        console.log(err);
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat simpan data", this.toastConfig);
        this.loadingNph = false;
      })
    } else {
      // this.register.PART_CSOS = [{ PART_ID: 0, CD_PARTYP: "20", PA_ID: this.register.DONOR_ID }];
      this.http.put(Globals.apiService + `/register/${this.rcId}`, this.register)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        let _register = res.data;
        this.loadingNph = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.router.navigate([`/pages/register/reqdoc/${_register.rd_id}/register/${_register.rc_id}`]);
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat ubah data", this.toastConfig);
        this.loadingNph = false;
      })
    }
  }

  assignBentukHibah(bentukHibahs: any[]) {
    let selected = 'v';
    let notSelected = 'x';
    this.bentukHibahList.forEach(el => {
      switch (el.id) {
        case '1':
          this.register.barang = bentukHibahs.includes(el.id) ? selected : notSelected;
          break;
        case '2':
          this.register.jasa = bentukHibahs.includes(el.id) ? selected : notSelected;
          break;
        case '3':
          this.register.kas = bentukHibahs.includes(el.id) ? selected : notSelected;
          break;
        case '4':
          this.register.surat_berharga = bentukHibahs.includes(el.id) ? selected : notSelected;
          break;
      }
    });
  }

  assignBentukHibahReverse(register) {
    this.bentukHibahList.forEach(el => {
      switch (el.value.toLowerCase()) {
        case 'barang':
          if(register.barang == 'v') this.cd_ud5.push(el.id);
          break;
        case 'kas':
          if(register.kas == 'v') this.cd_ud5.push(el.id);
          break;
        case 'jasa':
          if(register.jasa == 'v') this.cd_ud5.push(el.id);
          break;
        case 'surat berharga':
          if(register.surat_berharga == 'v') this.cd_ud5.push(el.id);
          break;
        default:
          break;
      }
    });
    this.selectedBentukHibah = [...this.cd_ud5];
  }

  alertDelete(jenis) {
    let title;

    switch (jenis) {
      case 'register':
        title = "Hapus Register";
        break;

      default:  
        title = "Hapus Register";
        break;
    }

    this.windowRef = this.windowService.open(this.alertTemplate, { title: title, context: { jenis } });
  }

  deleteData(jenis) {
    switch (jenis) {
      case 'register':
        this.delete();
        break;
    
      default:
        break;
    }
  }

  delete() {
    this.loadingNph = true;
    this.http.delete(Globals.apiService + `/register/${this.register.rc_id}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: any) => {
      this.loadingNph = false;
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
      this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
      this.toastConfig.pack = 'eva';
      this.toastService.show("Data Berhasil Dihapus", "Sukses", this.toastConfig);
      this.router.navigate([`/pages/register/reqdoc/${this.register.rd_id}/register`]);
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastConfig.icon = Globals.ToastIcon.Close;
      this.toastConfig.pack = 'eva';
      this.toastService.show(this.alertService.getHttpError(err), err.error.title || "Terjadi kesalahan saat hapus data", this.toastConfig);
      this.loadingNph = false;
    })
  }

  onGetList(type) {
    switch (type) {
      case 'econsect':
        let refData = [...this.sektorEkonomiList];
        this.windowRef = this.windowService.open(this.refTemplate, { title: 'Sektor Ekonomi', context: { titleModal: 'Sektor Ekonomi', type: type, refData: refData  } })
        break;
      case 'finsour':
        let refDataFinSour = [...this.sumberPembiayaanList];
        this.windowRef = this.windowService.open(this.refTemplate, { title: 'Sumber Pembiayaan', context: { titleModal: 'Sumber Pembiayaan', type: type, refData: refDataFinSour  } })
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
      if (type == 'econsect') {
        return this.sektorEkonomiList;
      } else {
        return this.sumberPembiayaanList;
      }
    }
  }

  selectRef(item, type) {
    switch (type) {
      case 'econsect':
        this.selectedSektorEkonomi = item;
        this.cd_econsect = item.value;
        //this.register.cd_econsect = this.cd_econsect.id;
        //this.changeDetectionRef.detectChanges();
        break;
      case 'finsour':
        this.selectedSumberPembiayaan = item;
        this.cd_fin_sour = item.value;
        //this.register.cd_fin_sour = this.cd_fin_sour.id;
        //this.changeDetectionRef.detectChanges();
        break;
      default:
        break;
    }
    console.log(item, this.register);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
