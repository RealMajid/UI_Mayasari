import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ECommerceComponent } from './e-commerce/e-commerce.component';
import { PanduanComponent } from './panduan/panduan.component';
import { ReportingComponent } from './reporting/reporting.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { GuardService } from '../../app/@core/utils/guard.service';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  canActivate: [GuardService],
  children: [
    {
      path: 'dashboard',
      component: ECommerceComponent,
      canActivate: [GuardService]
    },
    {
      path: 'report',
      component: ReportingComponent,
      canActivate: [GuardService]
    },
    {
      path: 'frontdesk',
      loadChildren: () => import('./frontdesk/frontdesk.module')
        .then(m => m.FrontdeskModule),
    },
    {
      path: 'pasien',
      loadChildren: () => import('./pasien/pasien.module')
        .then(m => m.PasienModule),
    },
    {
      path: 'tim-dokter',
      loadChildren: () => import('./dokter/dokter.module')
        .then(m => m.DokterModule),
    },
    {
      path: 'lab',
      loadChildren: () => import('./lab/lab.module')
        .then(m => m.LabModule),
    },
    {
      path: 'register',
      loadChildren: () => import('./register/register.module')
        .then(m => m.RegisterModule)
    },
    {
      path: 'monitor-hibah',
      loadChildren: () => import('./monitoring-pengelolaan-hibah/monitoring-pengelolaan-hibah.module')
        .then(m => m.MonitoringPengelolaanHibahModule),
    },
    {
      path: 'rekon-hibah',
      loadChildren: () => import('./rekonsiliasi-pendapatan-hibah/rekonsiliasi-pendapatan-hibah.module')
        .then(m => m.RekonsiliasiPendapatanHibahModule),
    },
    {
      path: 'panduan',
      component: PanduanComponent,
    },
    {
      path: 'edukasi',
      loadChildren: () => import('./edukasi/edukasi.module')
        .then(m => m.EdukasiModule),
    },
    {
      path: 'peraturan',
      loadChildren: () => import('./peraturan/peraturan.module')
        .then(m => m.PeraturanModule),
    },
    {
      path: 'helpdesk',
      loadChildren: () => import('./helpdesk/helpdesk.module')
        .then(m => m.HelpdeskModule),
    },
    {
      path: 'auth',
      loadChildren: () => import('./auth/auth.module')
        .then(m => m.AuthModule),
    },
    {
      path: 'reporting',
      component: ReportingComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: '**',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
