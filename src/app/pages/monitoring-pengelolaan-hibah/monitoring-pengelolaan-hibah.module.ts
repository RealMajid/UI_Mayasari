import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbDatepickerModule, NbFormFieldModule, NbButtonModule, NbActionsModule, NbDialogModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ThemeModule } from '../../@theme/theme.module';
import { MonitoringHibahRoutingModule, routedComponents } from './monitoring-hibah-routing.module';

@NgModule({
    imports: [
        NbDialogModule.forChild(),
        NbActionsModule,
        NbCardModule,
        NbTreeGridModule,
        NbIconModule,
        NbInputModule,
        NbDatepickerModule,
        NbFormFieldModule,
        NbButtonModule,
        ThemeModule,
        Ng2SmartTableModule,
        FormsModule,
        ReactiveFormsModule,
        MonitoringHibahRoutingModule,
        NbSelectModule,
        NbSpinnerModule
    ],
    declarations: [
        ...routedComponents,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MonitoringPengelolaanHibahModule { }