import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RpdWindowComponent } from './rpd-window/rpd-window.component';
import { of, Observable, Subject } from 'rxjs';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import * as Globals from '../../../../../globals';
import { AlertService } from '../../../../../@core/utils/alert.service';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-rpd',
  templateUrl: './rpd.component.html',
  styleUrls: ['./rpd.component.scss']
})
export class RpdComponent implements OnInit, OnDestroy {
  tahunAnggaran: string = new Date().getFullYear().toString();
  tahunAnggaranOptions: string[] = [];
  rpdList$: Observable<any[]>;
  selectedYear = new Date();
  filteredTahunAnggaranOptions$: Observable<string[]>;
  @Output() loadRpd = new EventEmitter();
  @Input() step: any;
  private sub: any;
  id: number;
  tab: any;
  rcId: number;
  toastConfig: any = Globals.toastConfig;
  sort;
  unsubscribe$ = new Subject<void>();
  dsbRegister: any = {};
  isPembatalan: boolean;

  constructor(private http: HttpClient,private alertService: AlertService,private toastService: NbToastrService, private router: Router, private route: ActivatedRoute, private dialogService: NbDialogService) {

  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];
      this.rcId = params["rcid"];
    });
    let tahunAnggaran = new Date().getFullYear();
    let taMin = tahunAnggaran - 20;
    let taMax = tahunAnggaran + 20;
    for (let i = taMin; i <= taMax; i++) {
      this.tahunAnggaranOptions.push(i.toString());
    }
    if(this.router.url.indexOf('pembatalan') != -1) this.isPembatalan = true;
    this.filteredTahunAnggaranOptions$ = of(this.tahunAnggaranOptions);
    this.getDsbRegisterList();
  }
  
  private filter(value: string): string[] {
    return this.tahunAnggaranOptions.filter(optionValue => optionValue.includes(value));
  }

  onTahunAnggaranChange(value: string) {
    this.filteredTahunAnggaranOptions$ = of(this.filter(value));
  }

  onSelectionChange(value) {
    this.tahunAnggaran = value;
    this.getDsbRegisterList();
  }

  getDsbRegisterList() {
    this.loadRpd.emit('true');
    this.http.get(Globals.apiService + `/DsbRegister?rc_id=${this.rcId}&sort=${this.sort}&fiscal_year=${this.tahunAnggaran}`)
    .pipe(takeUntil(this.unsubscribe$))  
    .subscribe((data: any) => {
        this.rpdList$ = of(data.data);
        console.log(data);
        this.loadRpd.emit('false');
      }, err => {
        if (err.error.Message) {
          this.loadRpd.emit('false');
        } else {
          this.loadRpd.emit('false');
        }
      });
  }

  newRpd() {
    this.dialogService.open(RpdWindowComponent, { context : { type: "new" } }).onClose
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(dsb => {
        if (dsb == null || dsb == undefined || dsb == 'cancel') return;
        this.dsbRegister.dr_id = 0;
        this.dsbRegister.rc_id = this.rcId;
        this.dsbRegister.amt = dsb.amt;
        this.dsbRegister.dsb_month = dsb.dsb_month;
        this.dsbRegister.fiscal_year = parseInt(this.tahunAnggaran);
        this.save();
        console.log(dsb);
      })
  }

  editRpd(item) {    
    let rpd = {...item};
    this.dialogService.open(RpdWindowComponent, { context: { type: "edit", rpd } }).onClose
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(dsb => {
      if (dsb == null || dsb == undefined || dsb == 'cancel') return;
      this.dsbRegister = dsb;
      this.save();
      console.log(dsb);
    });
  }

  save() {
    this.loadRpd.emit('true');
    if (this.dsbRegister.dr_id == 0) {
      this.http.post(Globals.apiService + '/dsbregister', this.dsbRegister)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadRpd.emit('false');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.getDsbRegisterList();
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
        this.loadRpd.emit('false');
      })
    } else {
      this.http.put(Globals.apiService + `/dsbregister/${this.dsbRegister.dr_id}`, this.dsbRegister)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadRpd.emit('false');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.getDsbRegisterList();
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
        this.loadRpd.emit('false');
      })
    }
  }

  deleteRpd(id) {
    this.loadRpd.emit('true');
    this.http.delete(Globals.apiService + `/dsbregister/${id}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: any) => {
      this.loadRpd.emit('false');
      this.rpdList$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => { if(data.length == 1) data.pop() });
      this.getDsbRegisterList();
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
      this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
      this.toastConfig.pack = 'eva';
      this.toastService.show("Data Berhasil Dihapus", "Sukses", this.toastConfig);
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastConfig.icon = Globals.ToastIcon.Close;
      this.toastConfig.pack = 'eva';
      this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
      this.loadRpd.emit('false');
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
