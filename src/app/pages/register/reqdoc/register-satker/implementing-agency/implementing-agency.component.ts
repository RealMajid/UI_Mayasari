import { Component, OnInit, ViewChild, Output, EventEmitter, OnDestroy, ChangeDetectorRef, TemplateRef, Input } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NbWindowService, NbDialogService, NbToastrService, NbAccordionComponent } from '@nebular/theme';
import { IaWindowComponent } from './ia-window/ia-window.component';
import { PaginationComponent } from '../../../../../@theme/components/pagination/pagination.component';
import * as Globals from '../../../../../globals';
import { RefService } from '../../../../../@core/utils/ref.service';
import { AlertService } from '../../../../../@core/utils/alert.service';
import { takeUntil } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'ngx-implementing-agency',
  templateUrl: './implementing-agency.component.html',
  styleUrls: ['./implementing-agency.component.scss']
})
export class ImplementingAgencyComponent implements OnInit, OnDestroy {

  @ViewChild(PaginationComponent, {static: true}) child: PaginationComponent;
  @ViewChild('item') accordion;
  @ViewChild('refTemplate', { static: true }) refTemplate: TemplateRef<any>;
  @Input() registerNo: any;
  @Input() step: any;
  implementingAgencyList$: Observable<any[]>;
  implementingAgency: any;
  pageNumber = 1;
  pageSize = 5;
  unsubscribe$ = new Subject<void>();
  toastConfig: any = Globals.toastConfig;
  participantList: any[];
  satkerList: any[];
  kementerianLembaga;
  selectedKL: any;
  satker;
  selectedSatker: any;
  @Output() loadIA = new EventEmitter();
  private sub: any;
  id: number;
  tab: any;
  rcId: number;
  sort;
  windowRef: any;
  searchRef: any;
  loadingData: boolean;
  isExpanded: boolean;
  mode;

  constructor(private refService: RefService, private windowService: NbWindowService, private changeDetectionRef: ChangeDetectorRef, private http: HttpClient,private alertService: AlertService,private toastService: NbToastrService, private router: Router, private route: ActivatedRoute, private dialogService: NbDialogService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];
      this.rcId = params["rcid"];
    });
    this.implementingAgency = { rc_id: this.rcId };
    this.getIAList(1);
    this.getListDeptParticipant();
  }

  getIAList(pageNumber: number) {
    this.loadIA.emit('true');
    this.pageNumber = pageNumber;
    let pagedList: any = {};
    this.http.get(Globals.apiService + `/part/partlist?rc_id=${this.rcId}&cd_partyp=37&sort=${this.sort}&limit=${this.pageSize}&offset=${pageNumber}`)
    .pipe(takeUntil(this.unsubscribe$))  
    .subscribe((data: any) => {
        pagedList.TotalPage = Math.ceil(data.total_record / this.pageSize);
        this.implementingAgencyList$ = of(data.data);
        this.child.getPagination(pageNumber, pagedList);
        console.log(data);
        this.loadIA.emit('false');
      }, err => {
        if (err.error.Message) {
          this.loadIA.emit('false');
        } else {
          this.loadIA.emit('false');
        }
      });
  }

  getListDeptParticipant() {
    this.loadingData = true;
    this.refService.getListDeptParticipant()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.participantList = data.data;
      if (this.implementingAgency.pa_id) {
        let selectedKl = this.participantList.filter(dep => dep.id == this.implementingAgency.pa_id)[0];
        this.selectedKL = selectedKl.value;
        this.getListSatker(selectedKl.name);
      } 
      this.loadingData = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingData = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getListSatker(kdDept) {
    this.loadingData = true;
    return this.refService.getListSatker(kdDept)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.satkerList = data.data;
      if (this.implementingAgency.kdsatker) {
        let selectedSatker = this.satkerList.filter(satker => satker.id == this.implementingAgency.kdsatker)[0];
        this.selectedSatker = selectedSatker.value;
      } 
      this.loadingData = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingData = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  newIA() {
    if (this.isExpanded && this.mode == "Rekam Baru") {
      this.isExpanded = false;
      return;
    } 
    this.mode = "Rekam Baru"
    this.implementingAgency = null;
    this.implementingAgency = { part_id: 0, rc_id: this.rcId };
    this.selectedKL = null;
    this.selectedSatker = null;
    this.isExpanded = true;
    this.changeDetectionRef.detectChanges();
    // this.dialogService.open(IaWindowComponent, { context : { type: "new" } }).onClose
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(ia => {
    //     if (ia == null || ia == undefined || ia == 'cancel') return;
    //     this.implementingAgency = ia;
    //     this.implementingAgency.part_id = 0;
    //     this.implementingAgency.cg_partyp = 7; // code group unit
    //     this.implementingAgency.cd_partyp = '37'; // Implementing Unit
    //     this.save();
    //     console.log(this.implementingAgency);
    // })
  }

  editIA(item) {    
    this.mode = "Edit";
    this.implementingAgency = {...item};
    this.selectedKL = item.name_part;
    this.kementerianLembaga = { id: item.pa_id, value: item.name_part };
    this.selectedSatker = item.nmsatker;
    this.satker = { id: item.kdsatker, value: item.nmsatker };
    console.log(item);
    if (this.isExpanded) return;
    this.isExpanded = true;
    this.changeDetectionRef.detectChanges();
    // this.dialogService.open(IaWindowComponent, { context: { type: "edit", implementingAgency } }).onClose
    // .pipe(takeUntil(this.unsubscribe$))
    // .subscribe(ia => {
    //   if (ia == null || ia == undefined || ia == 'cancel') return;
    //   this.implementingAgency = ia;
    //   this.save();
    //   console.log(ia);
    // });
  }

  // toggle() {
  //   this.accordion.toggle();
  // }

  onGetList(type) {
    switch (type) {
      case 'part':
        let refData = [...this.participantList];
        this.windowRef = this.windowService.open(this.refTemplate, { title: 'Kementerian/Lembaga', context: { titleModal: 'Kementerian/Lembaga', type: type, refData: refData  } });
        this.changeDetectionRef.detectChanges();
        break;
      case 'satker':
        let refDataSatker = [...this.satkerList];
        this.windowRef = this.windowService.open(this.refTemplate, { title: 'Satker', context: { titleModal: 'Satker', type: type, refData: refDataSatker  } })
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
        this.kementerianLembaga = item;
        this.selectedKL = item.value;
        this.implementingAgency.kdsatker = null;
        this.satker = null;
        this.selectedSatker = null;
        this.getListSatker(item.name);
        this.changeDetectionRef.detectChanges();
        break;
      case 'satker':
        this.satker = item;
        this.selectedSatker = item.value;
        this.changeDetectionRef.detectChanges();
        break;
      default:
        break;
    }
    console.log(item);
  }

  save() {
    this.loadIA.emit('true');
    this.implementingAgency.pa_id = this.kementerianLembaga.id;
    this.implementingAgency.part_name = this.kementerianLembaga.value;
    this.implementingAgency.kdsatker = this.satker.id;
    this.implementingAgency.nmsatker = this.satker.value;
    if (this.implementingAgency.part_id == 0) {
      this.implementingAgency.cg_partyp = 7; // code group unit
      this.implementingAgency.cd_partyp = '37'; // Implementing Unit
      this.http.post(Globals.apiService + '/part', this.implementingAgency)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadIA.emit('false');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.isExpanded = false;
        this.getIAList(1);
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
        this.loadIA.emit('false');
      })
    } else {
      this.http.put(Globals.apiService + `/part/${this.implementingAgency.part_id}`, this.implementingAgency)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((res: any) => {
        this.loadIA.emit('false');
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        this.toastService.show("Data Berhasil Disimpan", "Sukses", this.toastConfig);
        this.isExpanded = false;
        this.getIAList(1);
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
        this.loadIA.emit('false');
      })
    }
  }

  deleteIA(id) {
    this.loadIA.emit('true');
    this.http.delete(Globals.apiService + `/part/${id}`)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((res: any) => {
      this.loadIA.emit('false');
      this.implementingAgencyList$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => { if(data.length == 1) data.pop() });
      this.getIAList(1);
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
      this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
      this.toastConfig.pack = 'eva';
      this.toastService.show("Data Berhasil Dihapus", "Sukses", this.toastConfig);
      this.isExpanded = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.toastConfig.icon = Globals.ToastIcon.Close;
      this.toastConfig.pack = 'eva';
      this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
      this.loadIA.emit('false');
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
