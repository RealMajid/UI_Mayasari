import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginationComponent } from '../../../@theme/components/pagination/pagination.component';

@Component({
  selector: 'ngx-komunikasi-pasien',
  templateUrl: './komunikasi-pasien.component.html',
  styleUrls: ['./komunikasi-pasien.component.scss']
})
export class KomunikasiPasienComponent implements OnInit {

  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;

  orderMedisList$: Observable<any[]>;
  constructor() { }

  ngOnInit(): void {
  }

}
