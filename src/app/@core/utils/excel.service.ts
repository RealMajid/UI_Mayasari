import { Injectable } from '@angular/core';  
import { Workbook } from 'exceljs';  
import { DatePipe } from '@angular/common';  
import * as fs from 'file-saver';  
// import * as moment from 'moment';
import * as Globals from '../../globals';


@Injectable()  
export class ExcelService {
  private header: string[] = [];
  private fileName: string;

  constructor(private datePipe: DatePipe) {} 
  
  setHeader(header: string[]) {
    this.header = [];
    this.header = header;
  }

  setFileName(fileName: string) {
    this.fileName = "";
    this.fileName = fileName;
  }

  async generateExcel(data, workSheetName, authfilter = "") {  
      // Create workbook and worksheet  
      const workbook = new Workbook();  
      const worksheet = workbook.addWorksheet(workSheetName);

      // Cell Style : Fill and Header  
      var TodayDate = Globals.customFormatDate(Date.now);
      var FileName = this.fileName || "ExportData" + TodayDate;  
      worksheet.columns = this.header;

      var headerRow = worksheet.getRow(1);
      headerRow.eachCell((cell, number) => {  
          cell.fill = {  
              type: 'pattern',  
              pattern: 'solid',  
              fgColor: {  
                  argb: 'FFFFFFFF'  
              },  
              bgColor: {  
                  argb: 'FFFFFFFF'  
              },  
          };  
          cell.font = {  
              color: {  
                  argb: '00000000',  
              },  
              bold: true  
          }  
          cell.border = {  
              top: {  
                  style: 'thin'  
              },  
              left: {  
                  style: 'thin'  
              },  
              bottom: {  
                  style: 'thin'  
              },  
              right: {  
                  style: 'thin'  
              }  
          };  
      });  

      data.forEach(d => {  
          const row = worksheet.addRow(d);  
          row.fill = {  
              type: 'pattern',  
              pattern: 'solid',  
              fgColor: {  
                  argb: 'FFFFFFFF'  
              }  
          };  
          row.font = {  
              color: {  
                  argb: '00000000',  
              },  
              bold: false  
          }  
          row.eachCell((cell, number) => {  
              cell.border = {  
                  top: {  
                      style: 'thin'  
                  },  
                  left: {  
                      style: 'thin'  
                  },  
                  bottom: {  
                      style: 'thin'  
                  },  
                  right: {  
                      style: 'thin'  
                  }  
              };  
          });  
      });  

      workbook.xlsx.writeBuffer().then((data: any) => {  
          const blob = new Blob([data], {  
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'  
          });  
          fs.saveAs(blob, FileName + '.xlsx');  
      });  
  }  
}  