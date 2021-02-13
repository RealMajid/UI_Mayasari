import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">
      Powered by Mayasari IT Team 2021
    </span>
    <div class="socials" style="margin-right: 2%">
      <img style="height: 40px;" src="assets/images/kemenkes-logo.png" alt="kemenkes">
    </div>
  `,
})
export class FooterComponent {
}
