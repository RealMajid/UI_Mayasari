import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'ngx-rpd-window',
  templateUrl: './rpd-window.component.html',
  styleUrls: ['./rpd-window.component.scss']
})
export class RpdWindowComponent implements OnInit {

  bulan: any;
  nilai: any;
  @Input() type: any;
  @Input() rpd: any = {};

  constructor(private ref: NbDialogRef<RpdWindowComponent>) {
  }

  ngOnInit(): void {
    console.log(this.rpd, this.type);
    this.rpd = this.rpd || {};
    console.log(this.rpd);
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    console.log(this.rpd);
    this.ref.close(this.rpd);
  }

}
