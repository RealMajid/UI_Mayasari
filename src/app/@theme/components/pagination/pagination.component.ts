import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  pageNumber: number;
  pagination: any = [];
  parentPage: number = 0;
  totalParentPage: number = 0;
  pagedList: any;
  @Output() getDataSource = new EventEmitter();

  constructor() {
    this.pagedList = { TotalPage: 0 };
  }

  ngOnInit() {
  }

  getPagination(pageNumber: number, pagedList: any) {
    this.pageNumber = pageNumber;
    this.pagedList = pagedList;
    this.pagination = [];
    this.parentPage = Math.floor((this.pageNumber - 1) / 5);
    this.totalParentPage = Math.ceil(this.pagedList.TotalPage / 5);
    for (var i = 0; i < 5; i++) {
      var page = i + 1 + (this.parentPage * 5);
      this.pagination.push(page);
      if (page == this.pagedList.TotalPage) {
        break;
      }
    }
  }

  prev() {
    this.pageNumber = (5 * (this.parentPage - 1)) + 1;
    this.getData(this.pageNumber);
  }

  next() {
    this.pageNumber = (5 * (this.parentPage + 1)) + 1;
    this.getData(this.pageNumber);
  }

  getData(pageNumber: number) {
    this.getDataSource.emit(pageNumber);
  }

}
