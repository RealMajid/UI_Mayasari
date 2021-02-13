import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HelpdeskListComponent } from './helpdesk-list/helpdesk-list.component';
import { HelpdeskComponent } from './helpdesk.component';

const routes: Routes = [{
    path: '',
    component: HelpdeskComponent,
}, {
    path: '/kanwil',
    component: HelpdeskListComponent,
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class HelpdeskRoutingModule { }

export const routedComponents = [
    HelpdeskComponent,
    HelpdeskListComponent
];
