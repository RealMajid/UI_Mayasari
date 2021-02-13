import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbAlertModule, NbButtonModule, NbFormFieldModule, NbAccordionModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { EdukasiRoutingModule, routedComponents } from './edukasi-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClickOutsideDirective } from './materi/dropdown.directive';
import { SearchFilterPipe } from './materi/filter-pipe';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

@NgModule({
  imports: [
    EdukasiRoutingModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    NbAlertModule,
    FormsModule,
    ReactiveFormsModule,
    NbButtonModule,
    NbFormFieldModule,
    NgxDocViewerModule,
    NbAccordionModule
  ],
  declarations: [
    ...routedComponents,
    ClickOutsideDirective,
    SearchFilterPipe
  ],
})
export class EdukasiModule { }