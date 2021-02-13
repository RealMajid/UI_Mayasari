import {
    NbComponentStatus,
    NbGlobalLogicalPosition,
    NbGlobalPhysicalPosition,
    NbGlobalPosition,
    NbToastrService,
    NbToastrConfig,
  } from '@nebular/theme';


//var apiGateway = 'https://sbn-ritel.kemenkeu.go.id/gateway/api/hibahint';
var apiGateway = 'https://localhost:44363';
//var apiGateway = 'http://10.238.136.116';
//var apiGateway = 'http://10.100.83.131';
//var apiGateway = 'http://10.100.83.120';
//export var apiService = apiGateway + '/api/v1';
export var apiKemenkeuServcie = apiGateway + '/auth/api';
//export var apiService = apiGateway + '/api/hibahint/v1';
export var apiService = apiGateway + '/api';
export var reportService = apiGateway + '/Report';
export var jwtService = apiGateway + '/jwt';


export var formatDateTime = function (date: any) {
    var d = new Date(date || Date.now()),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-') + ' ' + d.getHours().toString() + ':' + d.getMinutes().toString();
}

export var customFormatDate = function (date: any) {
    console.log(date);
    var d = new String(date).substr(0,10).split("/"),
        month = d[1],
        day = d[0],
        year = d[2];
        console.log(d);
        console.log([month, day, year].join('/'));
    return new Date([month, day, year].join('/')) ;
}

export var formatDate = function(date: any) {
    var d = new Date(date || Date.now()),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

export var toastConfig =  {
    destroyByClick: true,
    duration: 4000,
    hasIcon: true,
    position: NbGlobalPhysicalPosition.BOTTOM_RIGHT,
    preventDuplicates: true,
  };

 export enum toastStatus {
    Primary = 'primary',
    Success = 'success',
    Info = 'info',
    Warning = 'warning',
    Danger = 'danger'
 };

 export enum ToastIcon {
     CheckmarkCircle = 'checkmark-circle-outline',
     Checkmark = 'checkmark-outline',
     Close = 'close-outline',
     CloseCircle = 'close-circle-outline'
 }

export var getToastStatus = function (status: NbComponentStatus) {
    return status;
};