import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Eksekutif',
    icon: 'briefcase-outline',
    children: [
      {
        title: 'Dashboard',
        link: '/dashboard',
      },
      {
        title: 'Laporan',
        link: '/report',
      },
    ],
    home: true,
  },
  // {
  //   title: 'IoT Dashboard',
  //   icon: 'home-outline',
  //   link: '/pages/iot-dashboard',
  // },
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Frontdesk',
    icon: 'book-open-outline',
    link: '/frontdesk',
  },
  {
    title: 'Pasien',
    icon: 'person-outline',
    children: [
          {
            title: 'Recent',
            link: '/pasien/recent/status',
          },
          {
            title: 'History',
            link: '/pasien/history',
          },
        ]
  },
  {
    title: 'Tim Dokter',
    icon: 'people-outline',
    link: '/tim-dokter',
  },
  {
    title: 'Lab',
    icon: 'thermometer-outline',
    link: '/lab/rekam-medis',
  },
  // {
  //   title: 'Register',
  //   icon: 'edit-2-outline',
  //   children: [
  //     {
  //       title: 'Dokumen Permintaan',
  //       link: '/pages/register/reqdoc'
  //     }
  //   ]
  // },
  // {
  //   title: 'Monitoring Pengelolaan Hibah',
  //   icon: 'eye-outline',
  //   children: [
  //     {
  //       title: 'Barang dan Jasa',
  //       link: '/pages/monitor-hibah/barangjasa',
  //     },
  //     {
  //       title: 'Kas',
  //       link: '/pages/monitor-hibah/kas',
  //     },
  //   ]
  // },
  // {
  //   title: 'e-Rekonsiliasi Hibah',
  //   icon: 'grid-outline',
  //   children: [
  //     {
  //       title: 'Pengajuan',
  //       // icon: 'file-outline',
  //       link: '/pages/rekon-hibah/pengajuan'
  //     },
  //     {
  //       title: 'Monitoring',
  //       // icon: 'eye-outline',
  //       link: '/pages/rekon-hibah/monitoring'
  //     },
  //     {
  //       title: 'Konfirmasi Donor',
  //       // icon: 'checkmark-circle-outline',
  //       link: '/pages/rekon-hibah/konfirmasi-donor'
  //     },
  //     {
  //       title: 'Rekon BA BUN 999.02',
  //       // icon: 'grid-outline',
  //       link: '/pages/rekon-hibah/rekon-ba-bun'
  //     }
  //   ]
  // },
  // {
  //   title: 'Panduan',
  //   icon: 'book-outline',
  //   link: '/pages/panduan',
  // },
  // {
  //   title: 'Edukasi',
  //   icon: 'bulb-outline',
  //   link: '/pages/edukasi',
  // },
  // {
  //   title: 'Peraturan',
  //   icon: 'umbrella-outline',
  //   link: '/pages/peraturan',
  // },
  // {
  //   title: 'Helpdesk Hibah',
  //   icon: 'headphones-outline',
  //   link: '/pages/helpdesk',
  // },
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Profil',
        link: '/pages/auth/profile',
      },
      {
        title: 'Pengguna',
        link: '/pages/auth/users',
      },
      {
        title: 'Group',
        link: '/pages/auth/groups',
      },
    ],
  },
];
