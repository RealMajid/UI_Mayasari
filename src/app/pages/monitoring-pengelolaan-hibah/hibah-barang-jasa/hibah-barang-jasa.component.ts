import { Component, OnInit, ViewChild, Output, Input, EventEmitter, OnDestroy } from '@angular/core';
import { PaginationComponent } from '../../../@theme/components/pagination/pagination.component';
import { Observable, of, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Filter } from '../../../models/Filter';
import { AlertService } from '../../../@core/utils/alert.service';
import { NbToastrService } from '@nebular/theme';
import * as Globals from '../../../globals';
import { HttpClient } from '@angular/common/http';
import { ExcelService } from '../../../@core/utils/excel.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-hibah-barang-jasa',
  templateUrl: './hibah-barang-jasa.component.html',
  styleUrls: ['./hibah-barang-jasa.component.scss']
})
export class HibahBarangJasaComponent implements OnInit, OnDestroy {

  @ViewChild(PaginationComponent, {static: true}) child: PaginationComponent;
  loadingData: boolean;

  monitorHibahBarangJasaList$: Observable<any[]>;
  unsubscribe$ = new Subject<void>();
  pageNumber = 1;
  pageSize = 10;
  search = '';
  sort = '';
  totalColumn = 31;
  columnNumberLabel: any[] = [];
  toastConfig: any = Globals.toastConfig;

  desc: boolean;
  showFilter: boolean;
  filterData: Filter[] = [];
  filterResult: Filter[] = [];
  @Output() changeFilterResult: EventEmitter<any> = new EventEmitter<any>();
  @Input() settings: any = {
    title: 'Monitoring Hibah Barang dan Jasa',
    column: [],
    data: [],
    alldata: [],
    orderBy: ''
  };

  constructor(private excelService: ExcelService,private http: HttpClient,private alertService: AlertService, private toastService: NbToastrService, private router: Router, private route: ActivatedRoute) {
    this.settings.column = [
      { title: 'No Register', type: 'text', name: 'register_no', visible: true },
      { title: 'Tgl Penetapan', type: 'date', name: 'tgl_penetapan', visible: true },
      { title: 'Kode BA', type: 'date', name: 'pa_id', visible: true },
      { title: 'Nama K/L', type: 'text', name: 'beneficiary_name', visible: true },
      { title: 'Sumber Hibah', type: 'text', name: 'sumber_hibah', visible: true },
      { title: 'Jenis Hibah', type: 'text', name: 'jenis_hibah', visible: true },
      { title: 'Bentuk Hibah', type: 'text', name: 'bentuk_hibah', visible: true },
      { title: 'Nama Hibah', type: 'text', name: 'nama_hibah', visible: true },
      { title: 'Pemberi Hibah', type: 'text', name: 'pemberi_hibah', visible: true },
      { title: 'Tgl Batas Penarikan', type: 'text', name: 'tgl_batas_penarikan', visible: true },
      { title: 'Mata Uang', type: 'text', name: 'mata_uang', visible: true },
      { title: 'Jumlah Hibah Valas', type: 'text', name: 'jumlah_hibah_valas', visible: true },
      { title: 'Jumlah Hibah Rupiah', type: 'text', name: 'jumlah_hibah_rupiah', visible: true },
      { title: 'Akun', type: 'text', name: 'akun', visible: true },
      { title: 'No Dokumen', type: 'text', name: 'no_dokumen', visible: true },
      { title: 'Tgl Pengesahan', type: 'text', name: 'tgl_pengesahan', visible: true },
      { title: 'Tahun', type: 'text', name: 'tahun', visible: true },
      { title: 'Bulan', type: 'text', name: 'bulan', visible: true },
      { title: 'Triwulan', type: 'text', name: 'triwulan', visible: true },
      { title: 'Semester', type: 'text', name: 'semester', visible: true },
      { title: 'K/L yang Mengesahkan', type: 'text', name: 'nm_kl', visible: true },
      { title: 'Satker yang Mengesahkan', type: 'text', name: 'nm_satker', visible: true },
      { title: 'Kode KPPN', type: 'text', name: 'kdkppn', visible: true },
      { title: 'Mata Uang Pendapatan', type: 'text', name: 'mata_uang_pendapatan', visible: true },
      { title: 'Pendapatan BJS Valas', type: 'text', name: 'pendapatan_bjs_valas', visible: true },
      { title: 'Pendapatan BJS Rupiah', type: 'text', name: 'pendapatan_bjs_rupiah', visible: true },
      { title: 'Mata Uang Aset', type: 'text', name: 'mata_uang_aset', visible: true },
      { title: 'Aset BJS Valas', type: 'text', name: 'aset_bjs_valas', visible: true },
      { title: 'Aset BJS Rupiah', type: 'text', name: 'aset_bjs_rupiah', visible: true },
    ]
    
    if(this.columnNumberLabel.length != this.totalColumn) {
      for (let index = 1; index <= this.totalColumn; index++) {
        this.columnNumberLabel.push(index);
      }
    }
  }

  ngOnInit() {
    this.getMonitoringHibahBarangJasaList(1);
  }

  getMonitoringHibahBarangJasaList(pageNumber: number) {
    this.loadingData = true;
    let pagedList: any = {};
    this.http.get(Globals.apiService + `/monitoring/barangjasa?search=${this.search}&sort=${this.sort}&limit=${this.pageSize}&offset=${pageNumber}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        this.pageNumber = pageNumber;
        pagedList.TotalPage = Math.ceil(data.total_record / this.pageSize);
        this.monitorHibahBarangJasaList$ = of(data.data);
        this.settings.data = data.data;
        this.child.getPagination(pageNumber, pagedList);
        this.loadingData = false;
      }, err => {
        if (err.error.Message) {
          this.loadingData = false;
        } else {
          this.loadingData = false;
        }
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
      });
  }

  getListAllMonitoringBarangJasa() {
    this.loadingData = true;
    return this.http.get(Globals.apiService + `/monitoring/allbarangjasa`)
  }

  addFilter() {
    var item = { value: undefined };
    this.filterData.push(item);
  }

  removeFilter(i: number) {
    this.filterData.splice(i);
    if (this.filterData.length == 0) {
      this._reset();
    }
  }

  _apply() {
    this.showFilter = false;
    for (var i = 0; i < this.filterData.length; i++) {
      if (this.filterData[i].value == undefined) {
        this.filterData.splice(i);
      }
    }
    Object.assign(this.filterResult, this.filterData);
    this.changeFilterResult.emit(this.filterResult);
  }

  _reset() {
    this.showFilter = false;
    this.filterData = [];
    if (this.settings?.column.length > 0) {
      if (this.filterData.length == 0) {
        this.filterData.push({ value: this.settings.column[0].value });
        this.filterData[0].condition = 'is';
        this.filterData[0].value = undefined;
      }
    }
  }

  showFilterClick() {
    this.showFilter = !this.showFilter;
    this.filterData = [];
    //Object.assign(this.filterData,this.filterResult);
    for (var i = 0; i < this.filterResult.length; i++) {
      var rec: Filter = { value: this.filterResult[i].value };
      rec.title = this.filterResult[i].title;
      rec.name = this.filterResult[i].name;
      rec.condition = this.filterResult[i].condition;
      rec.type = this.filterResult[i].type;
      this.filterData.push(rec);
    }
    if (this.settings?.column.length > 0) {
      if (this.filterData.length == 0) {
        this.filterData.push({ value: undefined });
        this.filterData[0].name = this.settings.column[0].name;
        this.filterData[0].condition = 'is';
        this.filterData[0].title = this.settings.column[0].title;
        this.filterData[0].type = this.settings.column[0].type;
      }
    }
  }

  onChange(val: string, rec: Filter) {
    for (var i = 0; i < this.settings.column.length; i++) {
      if (val == this.settings.column[i].name) {
        rec.type = this.settings.column[i].type;
        rec.title = this.settings.column[i].title;
        break;
      }
    }
  }

  _removeFilterResult(i: number) {
    this.filterResult.splice(i);
    this.changeFilterResult.emit(this.filterResult);
  }

  async exportAsExcel(type) {
    let dataMonitoring;
    if (type == 1) {
      dataMonitoring = this.settings.data;
      await this.exportSettings(dataMonitoring);
    } else {
      if (this.settings.alldata.length == 0) {
        this.getListAllMonitoringBarangJasa()
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(async (data: any) => {
          this.settings.alldata = data.data;
          dataMonitoring = data.data;
          await this.exportSettings(dataMonitoring);
          this.loadingData = false;
        }, err => {
          this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
          this.loadingData = false;
          this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
        })
      } else {
        await this.exportSettings(this.settings.alldata);
      }
    }
  }

  private async exportSettings(data) {
    let headers = this.settings.column.map(c => { 
      const container = {};

      container['header'] = c.title;
      container['key'] = c.name;
      container['width'] = c.width || 20;
  
      return container;
    });

  
    //console.log(headers);
    this.excelService.setHeader(headers);
    this.excelService.setFileName(`Data ${this.settings.title}`);
    await this.excelService.generateExcel(data, this.settings.title);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
