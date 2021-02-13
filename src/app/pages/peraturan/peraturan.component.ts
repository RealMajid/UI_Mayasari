import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { PeraturanService, Peraturan, PERATURAN_DATA } from './peraturan.service';
import { HttpClient } from '@angular/common/http';
import { PaginationComponent } from '../../@theme/components/pagination/pagination.component';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ngx-peraturan',
  templateUrl: './peraturan.component.html',
  styleUrls: ['./peraturan.component.scss']
})
export class PeraturanComponent implements OnInit, OnDestroy {

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
  unsubscribe$ = new Subject<void>();
  pageSize = 10;
  peraturanList$: Observable<any[]>;
  peraturanList: any = [];
  pageNumber = 1;
  pageSizePagination = 5;
  loadingPeraturan: boolean;
  showSearchResults: boolean;
  cd_rgl_typ: any;
  search: any;
  listData: any[];

  constructor(private http: HttpClient, private peraturanService: PeraturanService, private router: Router, private route: ActivatedRoute) {

  }

  ngOnInit() {
    console.log('init');
    this.getPeraturan(1);
    this.loadNext(this.firstCard);
  }

  loadNext(cardData) {
    if (cardData.loading) { return; }

    cardData.loading = true;
    cardData.placeholders = new Array(this.pageSize);
    this.peraturanService.load(cardData.pageToLoadNext, this.pageSize)
      .pipe(takeUntil(this.unsubscribe$))  
      .subscribe(nextPeraturan => {
        cardData.placeholders = [];
        cardData.peraturan.push(...nextPeraturan);
        cardData.loading = false;
        cardData.pageToLoadNext++;
      });
  }

  getPeraturan(pageNumber: number) {
    this.peraturanList = [...this.peraturanService.loadPaginationData()];
    this.listData = [...this.peraturanList];
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

  // getPeraturanList(pageNumber: number) {
  //   this.loadingPeraturan = true;
  //   this.pageNumber = pageNumber;
  //   let pagedList: any = {};
  //   this.peraturanService.loadPaginationData()
  //     .subscribe((data: any) => {
  //       console.log(data);
  //       pagedList.TotalPage = Math.ceil(data.length / this.pageSize);
  //       this.peraturanList$ = of(data);
  //       this.child.getPagination(pageNumber, pagedList);
  //       this.loadingPeraturan = false;
  //     }, err => {
  //       if (err.error.Message) {
  //         this.loadingPeraturan = false;
  //       } else {
  //         this.loadingPeraturan = false;
  //       }
  //     });
  // }

  onViewPeraturan(item) {
    this.router.navigate([`${item.rgl_id}`], {relativeTo: this.route, state: { peraturanData: item }});
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
