import { Injectable, Inject } from '@angular/core';
import { HttpHeaders } from "@angular/common/http";
import { JwtHelperService } from '@auth0/angular-jwt';
import * as Globals from "../../globals";

@Injectable()
export class HeaderService {
  public token: string;
  public tokenDecode: any;

  constructor(private jwtHelper: JwtHelperService) {
   }

  getHttpHeader() {
    var access_token = localStorage.getItem('access_token');
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + access_token,  "Content-Type": "application/json" });
    return headers;
  }

  openFile(data: any, fileName: string) {
    var arrFileName = fileName.split('.');
    var mimeType = this.getMimeType(arrFileName[1].toLowerCase());
    var file = new File([data], fileName, { type: mimeType });
    var url = window.URL.createObjectURL(file);
    //window.open(url, '_blank', '');
    var anchor = document.createElement('a');
    anchor.href = url;
    anchor.target = '_blank';
    anchor.click();
  }

  getMimeType(ext: string): string {
    switch (ext) {
      case "3gp": return "video/3gpp";
      case "7z": return "application/x-7z-compressed";
      case "accdb": return "application/msaccess";
      case "ai": return "application/illustrator";
      case "apk": return "application/vnd.android.package-archive";
      case "arw": return "image/x-dcraw";
      case "avi": return "video/x-msvideo";
      case "bash": return "text/x-shellscript";
      case "bat": return "application/x-msdos-program";
      case "blend": return "application/x-blender";
      case "bin": return "application/x-bin";
      case "bmp": return "image/bmp";
      case "bpg": return "image/bpg";
      case "bz2": return "application/x-bzip2";
      case "cb7": return "application/x-cbr";
      case "cba": return "application/x-cbr";
      case "cbr": return "application/x-cbr";
      case "cbt": return "application/x-cbr";
      case "cbtc": return "application/x-cbr";
      case "cbz": return "application/x-cbr";
      case "cc": return "text/x-c";
      case "cdr": return "application/coreldraw";
      case "class": return "application/java";
      case "cnf": return "text/plain";
      case "conf": return "text/plain";
      case "cpp": return "text/x-c++src";
      case "cr2": return "image/x-dcraw";
      case "css": return "text/css";
      case "csv": return "text/csv";
      case "cvbdl": return "application/x-cbr";
      case "c": return "text/x-c";
      case "c++": return "text/x-c++src";
      case "dcr": return "image/x-dcraw";
      case "deb": return "application/x-deb";
      case "dng": return "image/x-dcraw";
      case "doc": return "application/msword";
      case "docm": return "application/vnd.ms-word.document.macroEnabled.12";
      case "docx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      case "dot": return "application/msword";
      case "dotx": return "application/vnd.openxmlformats-officedocument.wordprocessingml.template";
      case "dv": return "video/dv";
      case "eot": return "application/vnd.ms-fontobject";
      case "epub": return "application/epub+zip";
      case "eps": return "application/postscript";
      case "erf": return "image/x-dcraw";
      case "exe": return "application/x-ms-dos-executable";
      case "flac": return "audio/flac";
      case "flv": return "video/x-flv";
      case "gif": return "image/gif";
      case "gpx": return "application/gpx+xml";
      case "gz": return "application/gzip";
      case "gzip": return "application/gzip";
      case "h": return "text/x-h";
      case "heic": return "image/heic";
      case "heif": return "image/heif";
      case "hh": return "text/x-h";
      case "hpp": return "text/x-h";
      case "htaccess": return "text/plain";
      case "ical": return "text/calendar";
      case "ics": return "text/calendar";
      case "iiq": return "image/x-dcraw";
      case "impress": return "text/impress";
      case "java": return "text/x-java-source";
      case "jp2": return "image/jp2";
      case "jpeg": return "image/jpeg";
      case "jpg": return "image/jpeg";
      case "jps": return "image/jpeg";
      case "k25": return "image/x-dcraw";
      case "kdc": return "image/x-dcraw";
      case "key": return "application/x-iwork-keynote-sffkey";
      case "keynote": return "application/x-iwork-keynote-sffkey";
      case "kml": return "application/vnd.google-earth.kml+xml";
      case "kmz": return "application/vnd.google-earth.kmz";
      case "kra": return "application/x-krita";
      case "ldif": return "text/x-ldif";
      case "love": return "application/x-love-game";
      case "lwp": return "application/vnd.lotus-wordpro";
      case "m2t": return "video/mp2t";
      case "m3u": return "audio/mpegurl";
      case "m3u8": return "audio/mpegurl";
      case "m4a": return "audio/mp4";
      case "m4b": return "audio/m4b";
      case "m4v": return "video/mp4";
      case "mdb": return "application/msaccess";
      case "mef": return "image/x-dcraw";
      case "mkv": return "video/x-matroska";
      case "mobi": return "application/x-mobipocket-ebook";
      case "mov": return "video/quicktime";
      case "mp3": return "audio/mpeg";
      case "mp4": return "video/mp4";
      case "mpeg": return "video/mpeg";
      case "mpg": return "video/mpeg";
      case "mpo": return "image/jpeg";
      case "msi": return "application/x-msi";
      case "mts": return "video/MP2T";
      case "mt2s": return "video/MP2T";
      case "nef": return "image/x-dcraw";
      case "numbers": return "application/x-iwork-numbers-sffnumbers";
      case "odf": return "application/vnd.oasis.opendocument.formula";
      case "odg": return "application/vnd.oasis.opendocument.graphics";
      case "odp": return "application/vnd.oasis.opendocument.presentation";
      case "ods": return "application/vnd.oasis.opendocument.spreadsheet";
      case "odt": return "application/vnd.oasis.opendocument.text";
      case "oga": return "audio/ogg";
      case "ogg": return "audio/ogg";
      case "ogv": return "video/ogg";
      case "one": return "application/msonenote";
      case "opus": return "audio/ogg";
      case "orf": return "image/x-dcraw";
      case "otf": return "application/font-sfnt";
      case "pages": return "application/x-iwork-pages-sffpages";
      case "pdf": return "application/pdf";
      case "pfb": return "application/x-font";
      case "pef": return "image/x-dcraw";
      case "php": return "application/x-php";
      case "pl": return "application/x-perl";
      case "pls": return "audio/x-scpls";
      case "png": return "image/png";
      case "pot": return "application/vnd.ms-powerpoint";
      case "potm": return "application/vnd.ms-powerpoint.template.macroEnabled.12";
      case "potx": return "application/vnd.openxmlformats-officedocument.presentationml.template";
      case "ppa": return "application/vnd.ms-powerpoint";
      case "ppam": return "application/vnd.ms-powerpoint.addin.macroEnabled.12";
      case "pps": return "application/vnd.ms-powerpoint";
      case "ppsm": return "application/vnd.ms-powerpoint.slideshow.macroEnabled.12";
      case "ppsx": return "application/vnd.openxmlformats-officedocument.presentationml.slideshow";
      case "ppt": return "application/vnd.ms-powerpoint";
      case "pptm": return "application/vnd.ms-powerpoint.presentation.macroEnabled.12";
      case "pptx": return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
      case "ps": return "application/postscript";
      case "psd": return "application/x-photoshop";
      case "py": return "text/x-python";
      case "raf": return "image/x-dcraw";
      case "rar": return "application/x-rar-compressed";
      case "reveal": return "text/reveal";
      case "rss": return "application/rss+xml";
      case "rtf": return "application/rtf";
      case "rw2": return "image/x-dcraw";
      case "schema": return "text/plain";
      case "sgf": return "application/sgf";
      case "sh-lib": return "text/x-shellscript";
      case "sh": return "text/x-shellscript";
      case "srf": return "image/x-dcraw";
      case "sr2": return "image/x-dcraw";
      case "tar": return "application/x-tar";
      case "tar.bz2": return "application/x-bzip2";
      case "tar.gz": return "application/x-compressed";
      case "tbz2": return "application/x-bzip2";
      case "tcx": return "application/vnd.garmin.tcx+xml";
      case "tex": return "application/x-tex";
      case "tgz": return "application/x-compressed";
      case "tiff": return "image/tiff";
      case "tif": return "image/tiff";
      case "ttf": return "application/font-sfnt";
      case "txt": return "text/plain";
      case "vcard": return "text/vcard";
      case "vcf": return "text/vcard";
      case "vob": return "video/dvd";
      case "vsd": return "application/vnd.visio";
      case "vsdm": return "application/vnd.ms-visio.drawing.macroEnabled.12";
      case "vsdx": return "application/vnd.ms-visio.drawing";
      case "vssm": return "application/vnd.ms-visio.stencil.macroEnabled.12";
      case "vssx": return "application/vnd.ms-visio.stencil";
      case "vstm": return "application/vnd.ms-visio.template.macroEnabled.12";
      case "vstx": return "application/vnd.ms-visio.template";
      case "wav": return "audio/wav";
      case "webm": return "video/webm";
      case "woff": return "application/font-woff";
      case "wpd": return "application/vnd.wordperfect";
      case "wmv": return "video/x-ms-wmv";
      case "xcf": return "application/x-gimp";
      case "xla": return "application/vnd.ms-excel";
      case "xlam": return "application/vnd.ms-excel.addin.macroEnabled.12";
      case "xls": return "application/vnd.ms-excel";
      case "xlsb": return "application/vnd.ms-excel.sheet.binary.macroEnabled.12";
      case "xlsm": return "application/vnd.ms-excel.sheet.macroEnabled.12";
      case "xlsx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      case "xlt": return "application/vnd.ms-excel";
      case "xltm": return "application/vnd.ms-excel.template.macroEnabled.12";
      case "xltx": return "application/vnd.openxmlformats-officedocument.spreadsheetml.template";
      case "xrf": return "image/x-dcraw";
      case "zip": return "application/zip";
      case "url": return "application/internet-shortcut";
      case "webloc": return "application/internet-shortcut";
      default: return "application/pdf";
    }
  }

//   goHome() {
//     window.location.href = Globals.portal + '/home';
//   }

//   getAccessMenu(routeName: string) {
//     if (!sessionStorage.getItem('access_token')) {
//       window.location.href = Globals.portal;
//     }
//     var decodeToken = this.jwtHelper.decodeToken(sessionStorage.getItem('access_token'));
//     var menuApps = JSON.parse(decodeToken.Menu);
//     var menuData: any = [];
//     for (var i = 0; i < menuApps.length; i++) {
//       if (menuApps[i].CD_APP == '11' && menuApps[i].UD2 == '/' + routeName) {
//         return true;
//       }
//     }
//     return false;
//   }

//   getHttpError(err: any) {
//     var message: string;
//     switch (err.status) {
//       case 0:
//         message = 'Kode respon: ' + err.status + ', Tidak terkoneksi dengan API service.';
//         break;
//       case 401:
//         message = 'Kode respon: ' + err.status + ', Unauthorized';
//         window.location.href = Globals.portal;
//         break;
//       case 403:
//         message = 'Kode respon: ' + err.status + ', Forbidden';
//         window.location.href = Globals.portal + '/home';
//         break;
//       case 404:
//         if (err.error != null) {
//           message = 'Kode respon: ' + err.status + ', ' + err.error.Message;
//         } else {
//           message = 'Kode respon: ' + err.status + ', API service tidak ditemukan.';
//         }
//         break;
//       default:
//         message = 'Kode respon: ' + err.status + ', ' + err.error.Message;
//         break;
//     }
//     return message;
//   }
  getApiFormatDate(date: any) {
    var d = new Date(date || Date.now()),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }
}