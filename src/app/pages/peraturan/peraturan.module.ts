import { NgModule } from '@angular/core';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbButtonModule, NbListModule, NbSelectModule, NbSpinnerModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';

import { NewsService } from './news.service';
import { PeraturanService } from './peraturan.service';
import { FormsModule } from '@angular/forms';
import { PeraturanRoutingModule, routedComponents } from './peraturan-routing.module';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

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
    PeraturanRoutingModule,
    NgxDocViewerModule
  ],
  declarations: [
    ...routedComponents
  ],
  providers: [
    NewsService,
    PeraturanService
  ],
})
export class PeraturanModule { }