import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MonitoringPengelolaanHibahModule } from './monitoring-pengelolaan-hibah/monitoring-pengelolaan-hibah.module';
import { PanduanModule } from './panduan/panduan.module';
import { EdukasiModule } from './edukasi/edukasi.module';
import { PeraturanModule } from './peraturan/peraturan.module';
import { ReportingModule } from './reporting/reporting.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    ECommerceModule,
    MiscellaneousModule,
    MonitoringPengelolaanHibahModule,
    PanduanModule,
    EdukasiModule,
    PeraturanModule,
    ReportingModule,
    AuthModule
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
