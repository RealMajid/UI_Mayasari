import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { NbThemeService } from '@nebular/theme';
import * as Globals from '../../../globals';
import { HttpClient } from '@angular/common/http';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-echarts-pie',
  template: `
    <div echarts [options]="options" class="echart"></div>
  `,
})
export class EchartsPieComponent implements OnInit, OnDestroy {
  options: any = {};
  themeSubscription: any;
  pieChartData: any;
  unsubscribe$ = new Subject<void>();

  constructor(private theme: NbThemeService, private http: HttpClient) {
  }

  ngOnInit() {
    this.getDashboardData();
  }

  getDashboardData() {
    this.http.get(Globals.apiService + `/dashboard/klinik`)
    .pipe(takeUntil(this.unsubscribe$))  
    .subscribe((data: any) => {
        this.pieChartData = data.Data.map(x => {
          let rObj = {};

          rObj['value'] = x.Value;
          rObj['name'] = x.Name;
          return rObj;
        })         
      }, err => {
        console.log(err);
      }, 
      () => this.ngAfterViewInit());
  }

  ngAfterViewInit() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors = config.variables;
      const echarts: any = config.variables.echarts;
      console.log(colors);

      this.options = {
        backgroundColor: echarts.bg,
        color: [colors.warningLight, colors.infoLight, colors.dangerLight, colors.successLight, colors.primaryLight,
                colors.warning, colors.info, colors.danger, colors.success, colors.primary],
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: this.pieChartData?.map(x => x.name) || [],
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Statistik Penyakit yang Diderita',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: this.pieChartData || [],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
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
