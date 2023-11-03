import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { GeneralService } from 'src/app/services/general/general.service';
import { AppConfig } from 'src/app/app.config';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-get-records',
  templateUrl: './get-records.component.html',
  styleUrls: ['./get-records.component.scss']
})
export class GetRecordsComponent implements OnInit {
  item: any;
  recordItems: any;
  vcOsid: any;
  headerName: string = 'plain'
  //headerName : string = 'issuer';

  documentName: string;
  pdfName: any;
  id: string;
  deletItem: { id: any; index: any; };
  selectedRows: any = [];

  constructor(public router: Router, public route: ActivatedRoute,
    public generalService: GeneralService, private http: HttpClient,
    private toastMsg : ToastMessageService, private translate: TranslateService,
    private config: AppConfig) {
    this.documentName = this.route.snapshot.paramMap.get('document');
    this.id = this.route.snapshot.paramMap.get('id');

  }

  ngOnInit(): void {
    this.getRecords();
  }

  getRecords() {
    let payout = {
      "filters": {}
    }
    this.generalService.postData('/' + this.documentName + '/search', payout).subscribe((res) => {
      console.log(res);
      this.recordItems = res;
    }, err => {
      this.recordItems = [];
      console.log(err);
    });
  }

  addRecord() {
    // this.router.navigate(['/add-records'] );
    // this.router.navigate(['/add-records'], { state: { item: this.item } });

  }

  downloadVc(item) {
    this.vcOsid = item.id;
    this.pdfName = (item.name) ? item.name : this.documentName;

    let headers = {
      Accept: 'text/html',
      'template-key': 'html',
    };

    this.downloadPDF();

  }
  onPress() {
    this.router.navigateByUrl['/pdf-view'];

  }

  downloadPDF() {

    let headerOptions = new HttpHeaders({
      'template-key': 'html',
      'Accept': 'application/pdf'
    });

    let requestOptions = { headers: headerOptions, responseType: 'blob' as 'blob' };
    // post or get depending on your requirement
    this.http.get(this.config.getEnv('baseUrl') + '/' + this.documentName + '/' + this.vcOsid, requestOptions).pipe(map((data: any) => {

      let blob = new Blob([data], {
        type: 'application/pdf' // must match the Accept type
        // type: 'application/octet-stream' // for excel 
      });
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = this.pdfName + '.pdf';
      link.click();
      window.URL.revokeObjectURL(link.href);

    })).subscribe((result: any) => {
    });

  }

  deleteTemplate() {
    for (let i = 0; i < this.selectedRows.length; i++) {
      let obj = this.selectedRows[i].split(':index:');
      this.generalService.deleteData('Schema/' + obj[0]).subscribe((res) => {
        this.recordItems.splice(obj[1], 1);
        let indexToDelete = this.recordItems.findIndex(x => x.osid === obj[0]);

        if (indexToDelete !== -1) {
          this.recordItems.splice(indexToDelete, 1);
        }
      },(err)=>{
        this.toastMsg.error('error', this.translate.instant('SOMETHING_WENT_WRONG_DELETE'));
      })
    }

  }

  DeleteItemPopup() {

    var button = document.createElement("button");
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', `#successDeleteModal`);
    document.body.appendChild(button)
    button.click();
    button.remove();
  }


  checkedItem(id, index) {
    id = id + ':index:' + index;
    if (!this.selectedRows.includes(id)) {
      this.selectedRows.push(id);
    } else {
      const index = this.selectedRows.indexOf(id);
      if (index !== -1) {
        this.selectedRows.splice(index, 1);
      }
    }

  }

  editRecord(id) {

  }

}
