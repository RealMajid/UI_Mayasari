import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-edukasi-detail',
  templateUrl: './edukasi-detail.component.html',
  styleUrls: ['./edukasi-detail.component.scss']
})
export class EdukasiDetailComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }

  onGoTo(route) {
    console.log(this.router.url, route);
    this.router.navigate([`${route}`], {relativeTo: this.route});
  }

}
