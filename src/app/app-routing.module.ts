import { ExtraOptions, RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { NgModule } from '@angular/core';
import {
  NbAuthComponent,
  NbLoginComponent,
  NbLogoutComponent,
  NbRegisterComponent,
  NbRequestPasswordComponent,
  NbResetPasswordComponent,
} from '@nebular/auth';
import { BlankComponent } from './@theme/layouts/blank/blank.component';
import { LoginGuardService } from './@core/utils/login-guard.service';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: BlankComponent,
    canActivate: [LoginGuardService],
    children: [
      { path: '', loadChildren: () => import('./login/login.module').then(m => m.LoginModule) }
    ]
  },
  {
    path: '',
    loadChildren: () => import('./pages/pages.module')
      .then(m => m.PagesModule),
  },
  { path: '**', redirectTo: 'login' },
];

const config: ExtraOptions = {
  preloadingStrategy: PreloadAllModules,
  useHash: false,
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
