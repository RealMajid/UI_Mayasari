import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NbCardModule, NbIconModule, NbInputModule, NbAlertModule, NbButtonModule, NbSpinnerModule, NbFormFieldModule, NbToastrModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { AuthRoutingModule, routedComponents } from './auth-routing.module';

@NgModule({
  imports: [
    AuthRoutingModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NbAlertModule,
    NbButtonModule,
    NbSpinnerModule,
    NbFormFieldModule,
    NbToastrModule,
    FormsModule
  ],
  declarations: [
    ...routedComponents,
  ],
})
export class AuthModule { }