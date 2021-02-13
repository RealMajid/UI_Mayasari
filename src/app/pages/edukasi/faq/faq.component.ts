import { Component, OnInit, OnDestroy } from '@angular/core';
import { NbThemeService } from '@nebular/theme';

@Component({
  selector: 'ngx-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, OnDestroy {
  themeSubscription: any;
  colors: any;

  constructor(private theme: NbThemeService) { }

  ngOnInit(): void {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      this.colors = config.variables;
      console.log(this.colors);
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

}
