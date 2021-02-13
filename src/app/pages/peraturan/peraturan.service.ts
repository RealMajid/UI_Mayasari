import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';

const TOTAL_PAGES = 1;
export const PERATURAN_DATA = 
[
    {
        rgl_id: 1,
        name: "Keputusan Menteri Keuangan Nomor 10/KMK.01/2010",
        description: "Keputusan Menteri Keuangan Nomor 10/KMK.01/2010 tentang SOP Layanan Unggulan Kementerian Keuangan",
        path: "assets/pdf/KMK_187_2010_SOP_Layanan_Unggulan.pdf",
        cg_rgl_typ: 0,
        cd_rgl_typ: "4"
    },
    {
        rgl_id: 2,
        name: "PP Nomor 48 Tahun 2018",
        description: "PP Nomor 48 Tahun 2018 tentang Tata Cara Pemberian Hibah Kepada Pemerintah Asing/Lembaga Asing",
        path: "assets/pdf/PP-Nomor-48-Tahun-2018.pdf",
        cg_rgl_typ: 0,
        cd_rgl_typ: "2"
    },
    {
        rgl_id: 3,
        name: "PP Nomor 57 Tahun 2019",
        description: "PP Nomor 57 Tahun 2019 tentang Perubahan atas Peraturan Pemerintah No. 48 Tahun 2018 Tentang Tata Cara Pemberian Hibah Kepada Pemerintah Asing/Lembaga Asing",
        path: "assets/pdf/PP-Nomor-57-Tahun-2019.pdf",
        cg_rgl_typ: 0,
        cd_rgl_typ: "2"
    },
    {
        rgl_id: 4,
        name: "Peraturan Menteri Keuangan Nomor 03/PMK.08/2016",
        description: "Peraturan Menteri Keuangan Nomor 03/PMK.08/2016 Tentang Perubahan Atas Peraturan Menteri Keuangan Nomor 92/PMK.08/2014 Tentang Pelaksanaan Belanja Hibah ke Pemerintah Asing/Lembaga Asing",
        path: "assets/pdf/PMK_No_3_PMK.08_2016_tentang_Perubahan_atas_PMK_No_92_PMK.08_2014_tentang_Belanja_Hibah_ke_Pemerintah_Lembaga_Asing.pdf",
        cg_rgl_typ: 0,
        cd_rgl_typ: "5"
    },
    {
        rgl_id: 5,
        name: "Keputusan Direktur Jenderal Pengelolaan Utang Nomor KEP-04/PU/2009",
        description: "Keputusan Direktur Jenderal Pengelolaan Utang Nomor KEP-04/PU/2009 tentang Klasifikasi Pinjaman Luar Negeri",
        path: "assets/pdf/perdirjen_04_2009_Klasifikasi_PLN.pdf",
        cg_rgl_typ: 0,
        cd_rgl_typ: "6"
    },
];

export class Peraturan {
    rgl_id: number;
    name: string;
    description: string;
    path: string;
    cg_rgl_typ: number;
    cd_rgl_typ: string;
}

@Injectable()
export class PeraturanService {

    constructor(private http: HttpClient) { }

    load(page: number, pageSize: number): Observable<Peraturan[]> {
        const startIndex = ((page - 1) % TOTAL_PAGES) * pageSize;

        return of([...PERATURAN_DATA])
            .pipe(
                map(news => news.splice(startIndex, pageSize)),
                delay(1500),
            );
    }

    loadPaginationData() {
        return [...PERATURAN_DATA];
    }
}
