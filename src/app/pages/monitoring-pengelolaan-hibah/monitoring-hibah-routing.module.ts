import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitoringPengelolaanHibahComponent } from './monitoring-pengelolaan-hibah.component';
import { HibahBarangJasaComponent } from './hibah-barang-jasa/hibah-barang-jasa.component';
import { HibahKasComponent } from './hibah-kas/hibah-kas.component';
import { GuardService } from '../../@core/utils/guard.service';

const routes: Routes = [{
  path: '',
  component: MonitoringPengelolaanHibahComponent,
  children: [
    {
      path: 'barangjasa',
      component: HibahBarangJasaComponent,
      canActivate: [GuardService]
    },
    {
      path: 'kas',
      component: HibahKasComponent,
      canActivate: [GuardService]
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonitoringHibahRoutingModule { }

export const routedComponents = [
    MonitoringPengelolaanHibahComponent,
    HibahBarangJasaComponent,
    HibahKasComponent
];
