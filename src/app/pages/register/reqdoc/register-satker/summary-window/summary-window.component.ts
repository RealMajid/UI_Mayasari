import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-summary-window',
  templateUrl: './summary-window.component.html',
  styleUrls: ['./summary-window.component.scss']
})
export class SummaryWindowComponent implements OnInit {

  @Input() summaryHibah: any;
  @Input() implementingAgencies: any = [];
  @Input() rencanaPenarikan: any = [];
  @Input() lokasiProyek: any = [];
  @Input() donor: any = {};


  constructor(private ref: NbDialogRef<SummaryWindowComponent>) {
   }

  ngOnInit(): void {
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    this.ref.close();
  }

}
