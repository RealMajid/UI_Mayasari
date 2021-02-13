import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeraturanComponent } from './peraturan.component';
import { PeraturanPlaceholderComponent } from './peraturan-placeholder/peraturan-placeholder.component';

const routes: Routes = [{
    path: '',
    component: PeraturanComponent,
}, {
    path: ':id',
    component: PeraturanPlaceholderComponent,
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PeraturanRoutingModule { }

export const routedComponents = [
    PeraturanComponent,
    PeraturanPlaceholderComponent
];
