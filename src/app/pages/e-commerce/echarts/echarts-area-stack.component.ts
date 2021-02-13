import { Component, OnDestroy, Input, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import * as Globals from '../../../globals';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-echarts-area-stack',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsAreaStackComponent implements OnInit, OnDestroy {
  options: any = {};
  themeSubscription: any;
  unsubscribe$ = new Subject<void>();
  areaStackData: any;
  namaBulan: string;
  namaHari: any;

  constructor(private theme: NbThemeService, private http: HttpClient) {
  }

  ngOnInit() {
    this.getDashboardData();
  }

  getDashboardData() {
    this.http.get(Globals.apiService + `/dashboard/pasienperminggu`)
    .pipe(takeUntil(this.unsubscribe$))  
    .subscribe((data: any) => {
          console.log(data);
          let areaStackObject: any = { registered: [], queuing: [], closed: [], checkup: [] };
          data.Data.map((item, index) => {
            areaStackObject.registered[index] = item.Registered;
            areaStackObject.queuing[index] = item.Queuing;
            areaStackObject.closed[index] = item.Closed;
            areaStackObject.checkup[index] = item.Checkup;
          });
          this.areaStackData = areaStackObject;
          this.namaHari = data.Data.map(x => x.Hari);
      }, err => {
        console.log(err);
      }, () =>
        this.ngAfterViewInit()
      );
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.primaryLight, colors.infoLight, colors.dangerLight, colors.successLight],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: echarts.tooltipBackgroundColor,
            },
          },
        },
        legend: {
          data: ['Pasien Terdaftar', 'Menunggu Antrian', 'Proses Pemeriksaan', 'Closed'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.namaHari || [],
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
            axisPointer: {
              label: {
                precision: '0'
              }
            }
          },
        ],
        series: [
          {
            name: 'Pasien Terdaftar',
            type: 'line',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: this.areaStackData?.registered || [],
          },
          {
            name: 'Menunggu Antrian',
            type: 'line',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: this.areaStackData?.queuing || [],
          },
          {
            name: 'Closed',
            type: 'line',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: this.areaStackData?.closed || [],
          },
          {
            name: 'Proses Pemeriksaan',
            type: 'line',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
            data: this.areaStackData?.checkup || [],
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
