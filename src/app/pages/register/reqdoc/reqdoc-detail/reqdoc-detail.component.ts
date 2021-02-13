import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { createHostBinding } from '@angular/compiler/src/core';

@Component({
  selector: 'ngx-reqdoc-detail',
  templateUrl: './reqdoc-detail.component.html',
  styleUrls: ['./reqdoc-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReqdocDetailComponent implements OnInit {

  private sub: any;
  id:number;
  tab: any;
  tabTitle: string;
  loadingDocument: boolean = false;
  loadingRegister: boolean = false;
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
    this.tabTitle = nameTab == "dokumen permohonan" ? "Dok. Permohonan" : $event.tabTitle;
    if (nameTab == "dokumen permohonan") {
      this.router.navigate([`../surat`], {relativeTo: this.route});
    } else if (nameTab == "register") {
      this.router.navigate([`../register`], {relativeTo: this.route});
    } else if (nameTab == "file pendukung") {
      this.router.navigate(['../file'], {relativeTo: this.route});
    } else {
      this.router.navigate([`../surat`], {relativeTo: this.route});
    }
  }

  onLoadDocument(event) {
    this.loadingDocument = event == 'true' ? true : false;
  }

  onLoadRegister(event) {
    this.loadingRegister = event == 'true' ? true : false;
  }

  onReqDocLoaded(event) {
    this.sentToKanwil = event;
    console.log(event);
  }

}
