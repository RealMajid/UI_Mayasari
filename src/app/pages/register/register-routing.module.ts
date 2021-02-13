import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterComponent } from './register.component';
import { ReqdocComponent } from './reqdoc/reqdoc.component';
import { ReqdocDetailComponent } from './reqdoc/reqdoc-detail/reqdoc-detail.component';
import { DocumentComponent } from './reqdoc/document/document.component';
import { RegisterSatkerComponent } from './reqdoc/register-satker/register-satker.component';
import { RegisterSatkerDetailComponent } from './reqdoc/register-satker/register-satker-detail/register-satker-detail.component';
import { GuardService } from '../../@core/utils/guard.service';
import { ImplementingAgencyComponent } from './reqdoc/register-satker/implementing-agency/implementing-agency.component';
import { RpdComponent } from './reqdoc/register-satker/rpd/rpd.component';
import { IaWindowComponent } from './reqdoc/register-satker/implementing-agency/ia-window/ia-window.component';
import { RpdWindowComponent } from './reqdoc/register-satker/rpd/rpd-window/rpd-window.component';
import { RelatedFilesComponent } from './reqdoc/related-files/related-files.component';
import { FileWindowComponent } from './reqdoc/related-files/file-window/file-window.component';
import { LokasiComponent } from './reqdoc/register-satker/lokasi/lokasi.component';
import { LokasiWindowComponent } from './reqdoc/register-satker/lokasi/lokasi-window/lokasi-window.component';
import { PemberiHibahComponent } from './reqdoc/register-satker/pemberi-hibah/pemberi-hibah.component';
import { ExecutingAgencyComponent } from './reqdoc/register-satker/executing-agency/executing-agency.component';
import { NphComponent } from './reqdoc/register-satker/nph/nph.component';
import { SummaryComponent } from './reqdoc/register-satker/summary/summary.component';
import { SummaryWindowComponent } from './reqdoc/register-satker/summary-window/summary-window.component';

const routes: Routes = [{
  path: '',
  component: RegisterComponent,
  children: [
    {
      path: 'reqdoc',
      component: ReqdocComponent,
      canActivate: [ GuardService ]
    },
    {
      path: 'reqdoc/:id/:tab',
      component: ReqdocDetailComponent,
      canActivate: [ GuardService ]
    },
    {
      path: 'reqdoc/:id/register/:rcid',
      component: RegisterSatkerDetailComponent,
      canActivate: [ GuardService ]
    },
    {
      path: 'reqdoc/:id/adendum/:rcid',
      loadChildren: () => import('./reqdoc/adendum-pembatalan/adendum-pembatalan.module')
        .then(m => m.AdendumPembatalanModule)
    },
    {
      path: 'reqdoc/:id/pembatalan/:rcid',
      loadChildren: () => import('./reqdoc/adendum-pembatalan/adendum-pembatalan.module')
        .then(m => m.AdendumPembatalanModule)
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRoutingModule { }

export const routedComponents = [
  RegisterComponent,
  ReqdocComponent,
  ReqdocDetailComponent,
  DocumentComponent,
  RegisterSatkerComponent,
  RegisterSatkerDetailComponent,
  ImplementingAgencyComponent,
  RpdComponent,
  IaWindowComponent,
  RpdWindowComponent,
  RelatedFilesComponent,
  FileWindowComponent,
  LokasiComponent,
  LokasiWindowComponent,
  PemberiHibahComponent,
  ExecutingAgencyComponent,
  NphComponent,
  SummaryComponent,
  SummaryWindowComponent
];
