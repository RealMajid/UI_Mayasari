import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-materi-detail',
  templateUrl: './materi-detail.component.html',
  styleUrls: ['./materi-detail.component.scss']
})
export class MateriDetailComponent implements OnInit {
  page: any;
  pageTitle: string;
  pdfSrc = "assets/pdf/20180920-Diseminasi-Hibah-Bandung-PMK-99.pdf";
  data: any = {};

  constructor(private route: ActivatedRoute, private router: Router) {
    this.page = route.snapshot.url[0].path;
    this.data = {...router.getCurrentNavigation().extras.state.detailData};
    console.log(this.data);
   }

  ngOnInit(): void {
    this.pageTitle = this.page == 'materi' ? 'Sosialisasi' : 'Prosedur dan Juknis';
  }

}
