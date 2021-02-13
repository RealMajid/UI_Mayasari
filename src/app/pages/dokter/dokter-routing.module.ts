import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DokterComponent } from './dokter.component';
import { AntrianPasienComponent } from './antrian-pasien/antrian-pasien.component';
import { RekamMedisComponent } from './rekam-medis/rekam-medis.component';
import { OrderMedisComponent } from './order-medis/order-medis.component';
import { KomunikasiPasienComponent } from './komunikasi-pasien/komunikasi-pasien.component';
import { DokterDetailComponent } from './dokter-detail/dokter-detail.component';
import { MonitoringComponent } from './monitoring/monitoring.component';

const routes: Routes = [
{
    path: '',
    component: DokterComponent,
},
{
    path: 'monitoring',
    component: MonitoringComponent
},
{
    path: 'detail/:id/:tab',
    component: DokterDetailComponent,
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DokterRoutingModule { }

export const routedComponents = [
    DokterComponent,
    AntrianPasienComponent,
    RekamMedisComponent,
    OrderMedisComponent,
    KomunikasiPasienComponent,
    DokterDetailComponent,
    MonitoringComponent
];
