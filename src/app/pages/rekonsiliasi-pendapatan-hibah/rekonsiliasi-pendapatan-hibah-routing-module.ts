import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RekonsiliasiPendapatanHibahComponent } from './rekonsiliasi-pendapatan-hibah.component';
import { PengajuanComponent } from './pengajuan/pengajuan.component';
import { MonitoringComponent } from './monitoring/monitoring.component';
import { KonfirmasiDonorComponent } from './konfirmasi-donor/konfirmasi-donor.component';
import { RekonBaBunComponent } from './rekon-ba-bun/rekon-ba-bun.component';

const routes: Routes = [{
  path: '',
  component: RekonsiliasiPendapatanHibahComponent,
  children: [
    {
      path: 'pengajuan',
      component: PengajuanComponent,
    },
    {
      path: 'monitoring',
      component: MonitoringComponent,
    },
    {
      path: 'konfirmasi-donor',
      component: KonfirmasiDonorComponent,
    },
    {
      path: 'rekon-ba-bun',
      component: RekonBaBunComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RekonsiliasiPendapatanHibahRoutingModule { }

export const routedComponents = [
  RekonsiliasiPendapatanHibahComponent,
  PengajuanComponent,
  MonitoringComponent,
  KonfirmasiDonorComponent,
  RekonBaBunComponent
];
