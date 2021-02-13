import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ngx-peraturan-placeholder',
  templateUrl: './peraturan-placeholder.component.html',
  styleUrls: ['./peraturan-placeholder.component.scss']
})
export class PeraturanPlaceholderComponent implements OnInit {

  page: any;
  pdfSrc = "assets/pdf/20180920-Diseminasi-Hibah-Bandung-PMK-99.pdf";
  data: any = {};

  constructor(private route: ActivatedRoute, private router: Router) {
    this.page = route.snapshot.url[0].path;
    this.data = {...router.getCurrentNavigation().extras.state.peraturanData};
    console.log(this.data);
   }

  ngOnInit(): void {
  }


}
