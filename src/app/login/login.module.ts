import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { RouterModule, Routes } from '@angular/router';
import { ThemeModule } from '../@theme/theme.module';
import { NgxCaptchaModule } from 'ngx-captcha';
import { NgxSpinnerModule } from "ngx-spinner";

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxCaptchaModule,
    ReactiveFormsModule,
    ThemeModule,
    RouterModule.forChild(routes),
    NgxSpinnerModule
  ],
  declarations: [LoginComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginModule { }
