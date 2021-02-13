import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbDatepickerModule, NbFormFieldModule, NbButtonModule, NbActionsModule, NbTabsetModule, NbRouteTabsetModule, NbSelectModule, NbAutocompleteModule, NbWindowModule, NbDialogModule, NbSpinnerModule, NbProgressBarModule, NbAccordionModule, NbPopoverModule, NbCheckboxModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { RegisterRoutingModule, routedComponents } from './register-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxBarcodeModule } from 'ngx-barcode';

@NgModule({
  imports: [
    NbActionsModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbDatepickerModule,
    NbFormFieldModule,
    NbButtonModule,
    ThemeModule,
    RegisterRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbSelectModule,
    NbAutocompleteModule,
    NbWindowModule.forChild(),
    NbDialogModule.forChild(),
    CurrencyMaskModule,
    NbSpinnerModule,
    NgxSpinnerModule,
    AutocompleteLibModule,
    NbProgressBarModule,
    NbAccordionModule,
    NgxPaginationModule,
    NgxBarcodeModule,
    NbPopoverModule,
    NbCheckboxModule
  ],
  declarations: [
    ...routedComponents,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegisterModule { }