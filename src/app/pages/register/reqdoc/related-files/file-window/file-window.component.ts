import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import * as Globals from '../../../../../globals';
import { AlertService } from '../../../../../@core/utils/alert.service';
import { HttpEventType, HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-file-window',
  templateUrl: './file-window.component.html',
  styleUrls: ['./file-window.component.scss']
})
export class FileWindowComponent implements OnInit {
  unsubscribe$ = new Subject<void>();
  toastConfig: any = Globals.toastConfig;
  bulan: any;
  nilai: any;
  progress = 0;
  uploading: boolean;
  @Input() type: any;
  @Input() rd_id: any;
  @Input() cd_doc_typ: any;
  @Input() file: any = {};
  relatedFile: any = {};
  displayNameFile: string;

  constructor(private changeDetectionRef: ChangeDetectorRef, private ref: NbDialogRef<FileWindowComponent>, private http: HttpClient, private alertService: AlertService, private toastService: NbToastrService) {
  }

  ngOnInit(): void {
    console.log(this.file, this.type);
    if (this.type == "new")
    {
      this.file = this.file || {};
    } else {
      this.file = this.file[0] || {};
    }
    console.log(this.file);
  }

  cancel() {
    this.ref.close();
  }

  submit() {
    console.log(this.file);
    this.ref.close(this.file);
  }

  get status() {
    if (this.progress <= 25) {
      return 'danger';
    } else if (this.progress <= 50) {
      return 'warning';
    } else if (this.progress <= 75) {
      return 'info';
    } else {
      return 'success';
    }
  }

  onChange(files) {
    let file = <File>files[0];
    console.log(file.name.substr(file.name.length - 1 - 4));
    if (file.name.substr(file.name.length - 1 - 3) != '.pdf') {
      this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show("File yang diupload harus berformat PDF", "File Tidak Valid", this.toastConfig);
        return;
      }
      this.displayNameFile = file.name;
    }

  public uploadFile = (files) => {
    if (files.length === 0) {

      return;
    }
    this.uploading = true;
    let fileToUpload = <File>files[0];

    this.relatedFile.doc_id = 0;
    this.relatedFile.rd_id = this.rd_id;
    this.relatedFile.doc_name = fileToUpload.name;
    this.relatedFile.cd_doc_typ = this.cd_doc_typ;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('document', JSON.stringify(this.relatedFile));
    this.http.post(Globals.apiService + '/document', formData, { reportProgress: true, observe: 'events' })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
          //this.changeDetectionRef.detectChanges();
        } else if (event.type === HttpEventType.Response) {
          setTimeout(() => {
            this.uploading = false;
            this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
            this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
            this.toastConfig.pack = 'eva';
            this.toastService.show("File Berhasil Diupload", "Sukses", this.toastConfig);
            this.displayNameFile = null;
            this.ref.close('success');
          }, 1000);
        }
      }, err => {
        this.uploading = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
        this.ref.close();
      });
  }
}
