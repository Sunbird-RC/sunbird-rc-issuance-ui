import { Injectable } from '@angular/core';
import { GeneralService } from '../general/general.service';
//import * as Papa from "papaparse";
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(private generalService: GeneralService) { }


  async getCSVColName(domain, schemaName)
  {
    let header = {
      Accept: '*/*'
    }
    await this.generalService.getData(domain + '/bulk/v1/bulk/sample/' + schemaName, true, header).subscribe((res) => {
      console.log(res);
      return res;
    }, err => {
      console.log(err);
    
      if(err.status == 200)
      {
      return  err.error.text
      }
    });
  }

  /**
   * Fetch Schema for CSV template
   */
  getTemplateSchema(id: string) {
    if (id.length < 1) {
      throwError(() => new Error('Id is missing'));
    } }

  downloadCSVTemplate(csvContent: string, fileName: string = 'template.csv') {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  generateCSV(columns: string[], data = [], fileName: string = 'template.csv') {
    if (columns.length < 1) {
      return;
    }
   // return Papa.unparse({ data, fields: columns });
  }
}