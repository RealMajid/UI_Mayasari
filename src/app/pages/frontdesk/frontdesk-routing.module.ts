import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FrontdeskComponent } from './frontdesk.component';

const routes: Routes = [{
    path: '',
    component: FrontdeskComponent,
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FrontdeskRoutingModule { }

export const routedComponents = [
    FrontdeskComponent,
];
