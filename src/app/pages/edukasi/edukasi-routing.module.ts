import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EdukasiComponent } from './edukasi.component';
import { MateriComponent } from './materi/materi.component';
import { FaqComponent } from './faq/faq.component';
import { EdukasiDetailComponent } from './edukasi-detail/edukasi-detail.component';
import { MateriDetailComponent } from './materi/materi-detail/materi-detail.component';

const routes: Routes = [{
  path: '',
  component: EdukasiComponent,
  children: [
    {
      path: '',
      component: EdukasiDetailComponent
    },
    {
      path: 'materi',
      component: MateriComponent,
    },
    {
      path: 'faq',
      component: FaqComponent,
    },
    {
      path: 'prosedur',
      component: MateriComponent,
    },
    {
      path: 'materi/:id',
      component: MateriDetailComponent,
    },
    {
      path: 'prosedur/:id',
      component: MateriDetailComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EdukasiRoutingModule { }

export const routedComponents = [
  MateriDetailComponent,
  EdukasiDetailComponent,
  EdukasiComponent,
  MateriComponent,
  FaqComponent
];
