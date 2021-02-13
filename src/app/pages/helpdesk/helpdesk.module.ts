import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbAlertModule, NbButtonModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { HelpdeskRoutingModule, routedComponents } from './heldesk-routing.module';

@NgModule({
  imports: [
    HelpdeskRoutingModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NbAlertModule,
    NbButtonModule,
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class HelpdeskModule { }