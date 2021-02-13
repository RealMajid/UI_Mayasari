import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbButtonModule, NbListModule, NbSelectModule, NbSpinnerModule, NbDatepickerModule, NbCalendarRangeModule, NbFormFieldModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { FormsModule } from '@angular/forms';
import { FrontdeskRoutingModule, routedComponents } from './frontdesk-routing.module';

@NgModule({
  imports: [
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NbButtonModule,
    NbListModule,
    NbSelectModule,
    NbSpinnerModule,
    FormsModule,
    NbFormFieldModule,
    FrontdeskRoutingModule,
    NbDatepickerModule,
    NbCalendarRangeModule
  ],
  declarations: [
    ...routedComponents
  ],
  providers: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FrontdeskModule { }