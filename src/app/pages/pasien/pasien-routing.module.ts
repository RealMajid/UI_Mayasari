import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasienDetailComponent } from './pasien-detail/pasien-detail.component';
import { PasienComponent } from './pasien.component';
import { StatusTungguComponent } from './status-tunggu/status-tunggu.component';
import { RekamMedisComponent } from './rekam-medis/rekam-medis.component';
import { HistoriTransaksiComponent } from './histori-transaksi/histori-transaksi.component';
import { HubungiDokterComponent } from './hubungi-dokter/hubungi-dokter.component';


const routes: Routes = [{
    path: '',
    redirectTo: 'recent',
    pathMatch: 'full',
},
{
    path: 'history',
    component: PasienComponent,
},
{
    path: 'history/:id/:tab',
    component: PasienDetailComponent,
},
{
    path: 'recent/:tab',
    component: PasienDetailComponent,
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PasienRoutingModule { }

export const routedComponents = [
    PasienComponent,
    PasienDetailComponent,
    StatusTungguComponent,
    RekamMedisComponent,
    HistoriTransaksiComponent,
    HubungiDokterComponent,
];
