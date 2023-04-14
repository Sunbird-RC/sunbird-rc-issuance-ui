import { Injectable } from '@angular/core';
import { GeneralService } from '../general/general.service';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(private generalService: GeneralService) { }

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

 
}