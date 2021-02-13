import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'ngx-materi',
  templateUrl: './materi.component.html',
  styleUrls: ['./materi.component.scss']
})
export class MateriComponent implements OnInit {
  searchForm: FormGroup;
  showDropDown = false;
  page: string;
  pageTitle: string;
  items: any;

  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.initForm();
    this.page = route.snapshot.url[0].path;
  }

  ngOnInit(): void {
    this.pageTitle = this.page == 'materi' ? 'Sosialisasi' : 'Prosedur dan Juknis';
    if (this.page == 'materi') {
        this.items = [{
          id: 1,
          title: 'Diseminasi',
          description: 'Diseminasi PMK No.99/2017 tentang Administrasi Pengelolaan Hibah, Bandung 20 September 2018',
          srcUrl: 'assets/pdf/20180920-Diseminasi-Hibah-Bandung-PMK-99.pdf'
        },
        {
          id: 2,
          title: 'Presentasi',
          description: 'Presentasi APBN dan Pembiayaan, Babel - 22 Agustus 2019',
          srcUrl: 'assets/pdf/PRESENTASI-APBN-DAN-PEMBIAYAAN.pdf'
        },
        {
          id: 3,
          title: 'Sosialisasi',
          description: 'Sosialisasi PMK 99/PMK.05/2017 (Surabaya 26 Oktober 2017 & Yogyakarta 9 November 2017)',
          srcUrl: 'assets/pdf/Sosialisasi-PMK-99.pdf'
        },
      ];
    } else {
      this.items = [{
        id: 3,
        title: 'Juknis',
        description: 'Perlakukan Hibah dalam Bentuk Barang Jasa Surat Berharga yang Belum Diregister dan atau Belum Disahkan s.d. Berakhirnya Tahun Anggaran',
        srcUrl: 'assets/pdf/Perlakuan-Hibah-Barang-Jasa-Surat_Berharga-Belum-Diregister_Disahkan-s.d.BerakhirnyaTA.pdf'
      },
      {
        id: 4,
        title: 'Juknis',
        description: 'Pengisian Form Pembukaan Rekening',
        srcUrl: 'assets/pdf/Petunjuk-Pengisian-Form-Pembukaan-Rekening.pdf'
      },
      {
        id: 5,
        title: 'Juknis',
        description: 'Pengisian Laporan Pelaksanaan PHLN',
        srcUrl: 'assets/pdf/Petunjuk-Pengisian-Lap-Monev-PHLN.pdf'
      },
    ];
    }
  }

  initForm(): FormGroup {
    return this.searchForm = this.fb.group({
      search: [null]
    })
  }

  onGoToMateriDetail(data) {
    this.router.navigate([`${data.id}`], {relativeTo: this.route, state: { detailData: data }});
  }

  openDropDown() {
    this.showDropDown = false;
  }

  closeDropDown() {
    this.showDropDown = !this.showDropDown;
  }

  getSearchValue() {
    return this.searchForm.value.search;
  }

}
