import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuardService } from '../../@core/utils/guard.service';
import { AuthComponent } from './auth.component';
import { GroupComponent } from './group/group.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [{
    path: '',
    component: AuthComponent,
    children: [
        {
          path: 'profile',
          component: ResetPasswordComponent,
          canActivate: [ GuardService ]
        },
        {
          path: 'users',
          component: UserComponent,
          canActivate: [ GuardService ]
        },
        {
          path: 'groups',
          component: GroupComponent,
          canActivate: [ GuardService ]
        },]
},];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule { }

export const routedComponents = [
    AuthComponent,
    ResetPasswordComponent,
    UserComponent,
    GroupComponent
];
