import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'ngx-dokter-detail',
  templateUrl: './dokter-detail.component.html',
  styleUrls: ['./dokter-detail.component.scss']
})
export class DokterDetailComponent implements OnInit {

  private sub: any;
  id:number;
  tab: any;
  tabTitle: string;
  loadingAntrian: boolean = false;
  loadingRekamMedis: boolean = false;
  sentToKanwil: any;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.tab = params['tab'];
    });
  }

  onChangeTab($event) {
    let nameTab = $event.tabTitle.toLowerCase();
    this.tabTitle = $event.tabTitle;
    if (nameTab == "rekam medis") {
      this.router.navigate([`../rekam-medis`], {relativeTo: this.route});
    } else if (nameTab == "order medis") {
      this.router.navigate(['../transaksi'], {relativeTo: this.route});
    } else if (nameTab == "komunikasi pasien") {
      this.router.navigate(['../komunikasi'], {relativeTo: this.route});
    } else {
      this.router.navigate([`../rekam-medis`], {relativeTo: this.route});
    }
  }

  onLoadStatusTunggu(event) {
    this.loadingAntrian = event == 'true' ? true : false;
  }

  onLoadRekamMedis(event) {
    this.loadingRekamMedis = event == 'true' ? true : false;
  }

  onReqDocLoaded(event) {
    this.sentToKanwil = event;
    console.log(event);
  }

}
