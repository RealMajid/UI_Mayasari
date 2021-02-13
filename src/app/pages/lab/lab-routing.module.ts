import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LabComponent } from './lab.component';
import { RekamMedisComponent } from './rekam-medis/rekam-medis.component';
import { RiwayatTestComponent } from './riwayat-test/riwayat-test.component';

const routes: Routes = [
{
    path: ':tab',
    component: LabComponent,
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LabRoutingModule { }

export const routedComponents = [
    LabComponent,
    RekamMedisComponent,
    RiwayatTestComponent,
];
