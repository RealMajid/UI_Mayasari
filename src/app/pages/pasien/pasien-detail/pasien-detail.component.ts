import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-pasien-detail',
  templateUrl: './pasien-detail.component.html',
  styleUrls: ['./pasien-detail.component.scss']
})
export class PasienDetailComponent implements OnInit {

  private sub: any;
  id:number;
  tab: any;
  tabTitle: string;
  loadingStatusTunggu: boolean = false;
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
    if (nameTab == "status tunggu") {
      this.router.navigate([`../status`], {relativeTo: this.route});
    } else if (nameTab == "rekam medis") {
      this.router.navigate([`../rekam-medis`], {relativeTo: this.route});
    } else if (nameTab == "histori transaksi") {
      this.router.navigate(['../transaksi'], {relativeTo: this.route});
    } else if (nameTab == "hubungi dokter") {
      this.router.navigate(['../hubungi-dokter'], {relativeTo: this.route});
    } else {
      this.router.navigate([`../status`], {relativeTo: this.route});
    }
  }

  onLoadStatusTunggu(event) {
    this.loadingStatusTunggu = event == 'true' ? true : false;
  }

  onLoadRekamMedis(event) {
    this.loadingRekamMedis = event == 'true' ? true : false;
  }

  onReqDocLoaded(event) {
    this.sentToKanwil = event;
    console.log(event);
  }

}
