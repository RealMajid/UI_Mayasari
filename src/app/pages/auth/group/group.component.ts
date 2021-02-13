import { HttpClient } from '@angular/common/http';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../../@core/utils/alert.service';
import { RefService } from '../../../@core/utils/ref.service';
import { PaginationComponent } from '../../../@theme/components/pagination/pagination.component';
import * as Globals from '../../../globals';

@Component({
  selector: 'ngx-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;
  firstCard = {
    peraturan: [],
    placeholders: [],
    loading: false,
    pageToLoadNext: 1,
  };
  // secondCard = {
  //   news: [],
  //   placeholders: [],
  //   loading: false,
  //   pageToLoadNext: 1,
  // };
  //showSearchResults = false;
  toastConfig: any = Globals.toastConfig;
  unsubscribe$ = new Subject<void>();
  pageSize = 10;
  sort: string = '';
  groupList$: Observable<any[]>;
  peraturanList: any = [];
  pageNumber = 1;
  pageSizePagination = 5;
  loadingGroup: boolean;
  parentGroupId: number = 0;
  showSearchResults: boolean;
  cd_rgl_typ: any;
  search: any;
  listData: any[];
  departemenList: any;
  satkerList: any;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, 
    private refService: RefService, private toastService: NbToastrService, private alertService: AlertService) {
  }

  ngOnInit() {
    this.getListDepartemen();
  }
  
  getGroupList(pageNumber: number, parentGroupId: number) {
    this.loadingGroup = true;
    let pagedList: any = {};
    this.http.get(Globals.apiService + `/group?search=${this.search}&parentGroupId=${this.parentGroupId}&sort=${this.sort}&limit=${this.pageSize}&offset=${pageNumber}`)
    .pipe(takeUntil(this.unsubscribe$))  
    .subscribe((data: any) => {
        pagedList.TotalPage = Math.ceil(data.total_record / this.pageSize);
        this.groupList$ = of(data.data);
        this.child.getPagination(pageNumber, pagedList);
        console.log(data);
        this.loadingGroup = false;
      }, err => {
        if (err.error.Message) {
          this.loadingGroup = false;
        } else {
          this.loadingGroup = false;
        }
      });
  }

  getListDepartemen() {
    this.loadingGroup = true;
    this.refService.getListDepartemen()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.departemenList = data.data;
      // if (this.reqDoc.kddept) {
      //   let selectedKl = this.departemenList.filter(dep => dep.id == this.reqDoc.kddept)[0];
      //   this.kementerianLembaga = selectedKl.value;
      //   this.getListSatker(selectedKl.id);
      // } 
      this.getGroupList(this.pageNumber, this.parentGroupId)
      this.loadingGroup = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingGroup = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    })
  }

  getListSatker(kdDept: string) {
    this.loadingGroup = true;
    return this.refService.getListSatker(kdDept)
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe(data => {
      this.satkerList = data.data;
      // if (this.reqDoc.kdsatker) {
      //   let selectedSatker = this.satkerList.filter(satker => satker.id == this.reqDoc.kdsatker)[0];
      //   this.satker = selectedSatker.value;
      // } 
      this.loadingGroup = false;
    }, err => {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
      this.loadingGroup = false;
      this.toastService.show(this.alertService.getHttpError(err), "Terjadi Kesalahan", this.toastConfig);
    }, () => { 
      // this.changeDetectionRef.markForCheck();
      // this.changeDetectionRef.detectChanges();
    })
  }

  onSearchPeraturan() {
    this.showSearchResults = true;
    if (this.cd_rgl_typ && this.search) {
      this.peraturanList = [...this.listData.filter(rg => {
        return (rg.cd_rgl_typ == this.cd_rgl_typ) && (rg.description.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || rg.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
      })];
    } else if (this.cd_rgl_typ && !this.search) {
      this.peraturanList = this.listData.filter(rg => rg.cd_rgl_typ == this.cd_rgl_typ);
    } else {
      this.peraturanList = [...this.listData.filter(rg => {
        return (rg.description.toLowerCase().indexOf(this.search.toLowerCase()) > -1 || rg.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1);
      })];
    }
    let pagedList: any = {};
    pagedList.TotalPage = Math.ceil(this.peraturanList.length/this.pageSizePagination);
    this.child.getPagination(1, pagedList);
    console.log(this.peraturanList);
  }

  onViewPeraturan(item) {
    this.router.navigate([`${item.rgl_id}`], {relativeTo: this.route, state: { peraturanData: item }});
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
