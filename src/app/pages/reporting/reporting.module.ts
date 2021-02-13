import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { ReportingComponent } from './reporting.component';

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule
  ],
  declarations: [
    ReportingComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ReportingModule { }