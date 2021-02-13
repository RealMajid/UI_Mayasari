import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-helpdesk',
  templateUrl: './helpdesk.component.html',
  styleUrls: ['./helpdesk.component.scss']
})
export class HelpdeskComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  onGoToHaloHibah() {
    window.open("http://www.djppr.kemenkeu.go.id/hibah/contact", "_blank");
  }

  onGoToListKanwil() {
    window.open("https://hai.kemenkeu.go.id/", "_blank");
  }

}
