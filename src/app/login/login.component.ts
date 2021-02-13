import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '../@core/utils/alert.service';
import { HttpClient } from '@angular/common/http';
import * as Globals from '../globals';
import * as CryptoJS from 'crypto-js';
import {
  NbComponentStatus,
  NbGlobalLogicalPosition,
  NbGlobalPhysicalPosition,
  NbGlobalPosition,
  NbToastrService,
  NbToastrConfig,
} from '@nebular/theme';
import { NgxSpinnerService } from 'ngx-spinner';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IdentityService } from '../@core/utils/identity.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: any = {};
  redirectTo: string;
  loading: boolean;
  errorRequest: boolean;
  errorMessage: string;
  aFormGroup: FormGroup;
  captchaOption = {
    siteKey:'6Ld6d8YZAAAAALIWeK4HKoI1qaslvD-wJkmpMbt6'
    //siteKey: '6LfejtoUAAAAANqD2FGOIY9T2w4F-BzBwPGUZbjP'
  };
  loginEnable: boolean;
  position: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_RIGHT
  //toastConfig: any = Globals.toastConfig;
  toastConfig = {
    destroyByClick: true,
    duration: 2000,
    hasIcon: true,
    position: this.position,
    preventDuplicates: true,
  };

  constructor(private identityService: IdentityService,public toastService: NbToastrService, private formBuilder: FormBuilder, private router: Router, private http: HttpClient, private route: ActivatedRoute, private spinner: NgxSpinnerService) { 
  }

  ngOnInit() {
    this.aFormGroup = this.formBuilder.group({
      recaptcha: ['', Validators.required]
    });
  }

  handleSuccess() {
    this.loginEnable = true;
  }
  login(val: boolean) {
    this.errorRequest = false;
    this.errorMessage = '';
    this.loading = true;
   
    if (!val) {
      this.errorRequest = true;
      this.errorMessage = 'Username dan password harus diisi.';
    }
    else {
      var content = { Username: this.form.username, Password: this.form.password };
      this.http.post(Globals.jwtService + '/jwt', content)
        .subscribe(data => {
          this.spinner.show();
          var result: any = data;
          console.log(data);
          localStorage.setItem('access_token', result);
          this.identityService.getUserIdentity();
          let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          switch (this.identityService.role.toLowerCase()) {
            case "super admin":
              this.redirectTo = '/dashboard';
              break;
            case "frontdesk":
              this.redirectTo = '/frontdesk';
              break;
            case "eksekutif":
              this.redirectTo = '/dashboard';
              break;
            case "pasien":
              this.redirectTo = '/pasien/recent/status';
              break;
            case "dokter":
              this.redirectTo = '/tim-dokter';
              break;
            case "lab":
              this.redirectTo = 'lab/rekam-medis';
              break;
            default:
              this.redirectTo = '/tim-dokter';
              break;
          }
          this.router.navigate([returnUrl || this.redirectTo]);
          this.loading = false;
          this.spinner.hide();
        }, err => {
          if (err.error.Message) {
            this.loading = false;
            this.errorRequest = true;
            this.errorMessage = 'Invalid user name or password';
          } else {
            this.loading = false;
            this.errorRequest = true;
            this.errorMessage = 'Invalid user name or password';
          }
        });
    }
  }
}
