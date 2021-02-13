import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ImplementingAgencyComponent } from './implementing-agency/implementing-agency.component';
import { RpdComponent } from './rpd/rpd.component';
import { IaWindowComponent } from './implementing-agency/ia-window/ia-window.component';
import { RpdWindowComponent } from './rpd/rpd-window/rpd-window.component';
import { LokasiComponent } from './lokasi/lokasi.component';
import { LokasiWindowComponent } from './lokasi/lokasi-window/lokasi-window.component';
import { PemberiHibahComponent } from './pemberi-hibah/pemberi-hibah.component';
import { ExecutingAgencyComponent } from './executing-agency/executing-agency.component';
import { NphComponent } from './nph/nph.component';
import { SummaryComponent } from './summary/summary.component';
import { AdendumPembatalanComponent } from './adendum-pembatalan.component';
import { GuardService } from '../../../../@core/utils/guard.service';
import { RegisterSatkerDetailComponent } from './register-satker-detail/register-satker-detail.component';

const routes: Routes = [{
    path: '',
    component: AdendumPembatalanComponent,
    children: [
        {
            path: '',
            component: RegisterSatkerDetailComponent,
            canActivate: [GuardService]
        }
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdendumPembatalanRoutingModule { }

export const routedComponents = [
    AdendumPembatalanComponent,
    RegisterSatkerDetailComponent,
    ImplementingAgencyComponent,
    RpdComponent,
    IaWindowComponent,
    RpdWindowComponent,
    LokasiComponent,
    LokasiWindowComponent,
    PemberiHibahComponent,
    ExecutingAgencyComponent,
    NphComponent,
    SummaryComponent
];
