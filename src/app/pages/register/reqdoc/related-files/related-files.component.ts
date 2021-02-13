import { Component, OnInit, ViewChild, OnDestroy, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Input } from '@angular/core';
import { PaginationComponent } from '../../../../@theme/components/pagination/pagination.component';
import { Observable, of, Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { FileWindowComponent } from './file-window/file-window.component';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import * as Globals from '../../../../globals';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../../../../@core/utils/alert.service';

@Component({
  selector: 'ngx-related-files',
  templateUrl: './related-files.component.html',
  styleUrls: ['./related-files.component.scss']
})
export class RelatedFilesComponent implements OnInit, OnDestroy {

  @ViewChild(PaginationComponent, { static: true }) child: PaginationComponent;
  @ViewChild('item') accordion;
  relatedFileList$: Observable<any[]>;
  relatedFileList: any = [];
  unsubscribe$ = new Subject<void>();
  @Output() loadFilePendukung = new EventEmitter();
  @Input() sentToKanwil: any;
  toastConfig: any = Globals.toastConfig;
  pageNumber = 1;
  pageSize = 5;
  progress = 0;
  uploadingFile: boolean;
  private sub: any;
  id: number;
  tab: any;
  search;
  sort;
  relatedFile;
  displayNameFile;
  suratPengantar: any;
  ringkasanHibah: any;
  ringkasanHibahLegalisir: any;
  dokPendelegasianWewenang: any;

  constructor(private changeDetectionRef: ChangeDetectorRef,private alertService: AlertService, private toastService: NbToastrService, private http: HttpClient, private router: Router, private route: ActivatedRoute, private dialogService: NbDialogService) {
    this.sub = this.route.params.subscribe((params) => {
      this.id = params["id"];
      this.tab = params["tab"];
    });
    this.relatedFile = { rd_id: this.id };
  }

  ngOnInit() {
    this.getFilePendukungList(1);
  }

  async getFilePendukungList(pageNumber: number) {
    this.loadFilePendukung.emit('true');
    let pagedList: any = {};
    this.http.get(Globals.apiService + `/document?rd_id=${this.id}&search=${this.search}&sort=${this.sort}&limit=${this.pageSize}&offset=${pageNumber}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: any) => {
        pagedList.TotalPage = Math.ceil(data.total_record / this.pageSize);
        console.log(data);
        let indexSuratPengantar = data.data.findIndex(f => f.cd_doc_typ == 1);
        let indexRingkasanHibah = data.data.findIndex(f => f.cd_doc_typ == 2);
        let indexRingkasanHibahLegalisir = data.data.findIndex(f => f.cd_doc_typ == 3);
        let indexDokPendelegasianWewenang = data.data.findIndex(f => f.cd_doc_typ == 4);
        if(indexSuratPengantar != -1) this.suratPengantar = data.data[indexSuratPengantar];
        if(indexRingkasanHibah != -1) this.ringkasanHibah = data.data[indexRingkasanHibah];
        if(indexRingkasanHibahLegalisir != -1) this.ringkasanHibahLegalisir = data.data[indexRingkasanHibahLegalisir];
        if(indexDokPendelegasianWewenang != -1) this.dokPendelegasianWewenang = data.data[indexDokPendelegasianWewenang];
        this.relatedFileList$ = of(data.data.filter(f => f.cd_doc_typ == null));
        this.changeDetectionRef.detectChanges();
        this.child.getPagination(pageNumber, pagedList);
        this.loadFilePendukung.emit('false');
      }, err => {
        if (err.error.Message) {
          this.loadFilePendukung.emit('false');
        } else {
          this.loadFilePendukung.emit('false');
        }
      });
  }

  onChange(files) {
    let file = <File>files[0];
    this.displayNameFile = file.name;
  }

  toggle() {
    this.accordion.toggle();
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

  onUploadDocument(type) {
    this.dialogService.open(FileWindowComponent, { context : { type: "new", cd_doc_typ: type, rd_id: this.id } }).onClose
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(file => {
        if (file == null || file == undefined || file == 'cancel') return;
        this.getFilePendukungList(1);
      })
  }

  onEditDocument(type) { 
    let file; 
    if (type == 1) {
      file = {...this.suratPengantar};
    } else if (type == 2) {
      file = {...this.ringkasanHibah};
    } else if (type == 3) {
      file = {...this.ringkasanHibahLegalisir};
    } else {
      file = {...this.dokPendelegasianWewenang};
    }
    this.dialogService.open(FileWindowComponent, { context: { type: "edit", cd_doc_typ: type, file } }).onClose
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(file => {
        if (file == null || file == undefined || file == 'cancel') return;
        console.log(file);
      });
  }

  onGoToRelatedFiles(rcId) {
    this.router.navigate([`${rcId}`], { relativeTo: this.route });
  }

  public uploadFile = (files) => {
    if (files.length === 0) {

      return;
    }
    this.uploadingFile = true;
    let fileToUpload = <File>files[0];

    this.relatedFile.doc_id = 0;
    this.relatedFile.doc_name = fileToUpload.name;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('document', JSON.stringify(this.relatedFile));
    this.http.post(Globals.apiService + '/document', formData, { reportProgress: true, observe: 'events' })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total);
          this.changeDetectionRef.detectChanges();
        } else if (event.type === HttpEventType.Response) {
          setTimeout(async () => {
            this.uploadingFile = false;
            this.accordion.toggle();
            this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
            this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
            this.toastConfig.pack = 'eva';
            await this.getFilePendukungList(1);
            this.toastService.show("File Berhasil Diupload", "Sukses", this.toastConfig);
            this.displayNameFile = null;
          }, 1000);
          //this.onUploadFinished.emit(event.body);
        }
      }, err => {
        this.uploadingFile = false;
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
      });
  }

  download(item) {
    this.loadFilePendukung.emit('true');
    this.http.request(new HttpRequest('GET', Globals.apiService + `/document/download/${item.doc_id}`, null, { reportProgress: true, responseType: 'blob' }))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data: any) => {
          switch (data.type) {
            case HttpEventType.DownloadProgress:
              //this.downloadStatus.emit({ status: ProgressStatusEnum.IN_PROGRESS, percentage: Math.round((data.loaded / data.total) * 100) });
              break;
            case HttpEventType.Response:
              this.loadFilePendukung.emit('false');
              const downloadedFile = new Blob([data.body], { type: data.body.type });
              const a = document.createElement('a');
              a.setAttribute('style', 'display:none;');
              document.body.appendChild(a);
              a.download = item.doc_name;
              a.href = URL.createObjectURL(downloadedFile);
              a.target = '_blank';
              a.click();
              document.body.removeChild(a);
              break;
          }
        },
        err => {
          this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
          this.toastConfig.icon = Globals.ToastIcon.Close;
          this.toastConfig.pack = 'eva';
          this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
          this.loadFilePendukung.emit('false');
        }
      );
  }

  deleteFile(id) {
    this.loadFilePendukung.emit('true');
    this.http.delete(Globals.apiService + `/document/${id}`)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(async (res: any) => {
        this.loadFilePendukung.emit('false');
        this.relatedFileList$.pipe(takeUntil(this.unsubscribe$)).subscribe(data => { if (data.length == 1) data.pop() });
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Success);
        this.toastConfig.icon = Globals.ToastIcon.CheckmarkCircle;
        this.toastConfig.pack = 'eva';
        await this.getFilePendukungList(1);
        this.toastService.show("File Berhasil Dihapus", "Sukses", this.toastConfig);
      }, err => {
        this.toastConfig.status = Globals.getToastStatus(Globals.toastStatus.Danger);
        this.toastConfig.icon = Globals.ToastIcon.Close;
        this.toastConfig.pack = 'eva';
        this.toastService.show(this.alertService.getHttpError(err), "Error", this.toastConfig);
        this.loadFilePendukung.emit('false');
      })
  }
  
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

}
