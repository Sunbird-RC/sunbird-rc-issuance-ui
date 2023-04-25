import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFormOptions, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { TranslateService } from '@ngx-translate/core';
import { GeneralService } from 'src/app/services/general/general.service';
import { JSONSchema7 } from "json-schema";
import { SchemaService } from 'src/app/services/data/schema.service';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';
@Component({
  selector: 'dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  headerName: string = 'plain';

  templatesItems: any;
  issuerInfo: any;

  form2: FormGroup;
  model = {};
  schemaloaded = false;
  options: FormlyFormOptions;
  fields: FormlyFieldConfig[];
  schema: JSONSchema7 = {
    "type": "object",
    "title": "",
    "definitions": {},
    "properties": {},
    "required": []
  };
  form: string;
  formSchema: any;
  responseData: any;
  definations: any;
  property: any;
  schemaName: any;
  item: any;
  templatePath: any;
  entityName: any;
  temp: any;
  editedIssuerInfo: any;
  isOpen: boolean = true;
  modal: HTMLElement;
  flag: boolean = false;
  identifier: string;

  constructor(public generalService: GeneralService, public router: Router, public toastMsg: ToastMessageService,
    private formlyJsonschema: FormlyJsonschema, public schemaService: SchemaService, private route: ActivatedRoute) {

  }
  ngAfterViewChecked() {
     (<HTMLInputElement>document.getElementById("formly_8_string_userId_0")).disabled = true; 
  }

  ngOnInit(): void {

    // this.route.params.subscribe(params => {
    //   this.form = params['form'].split('/', 1)[0];
    //   this.identifier = params['form'].split('/', 1)[1];
    // });
    // if(localStorage.getItem('entity-osid')){
    //   this.identifier = localStorage.getItem('entity-osid')
    // }
    // else{
    //   console.log("Not Authorized")
    // }
    this.getDocument();
    this.getIssuer();

  }


  getFormJSON() {
    this.form = 'issuer-setup';
    this.schemaService.getFormJSON().subscribe((FormSchemas) => {
      var filtered = FormSchemas.forms.filter(obj => {
        return Object.keys(obj)[0] === this.form;
      })
      this.formSchema = filtered[0][this.form];
      this.templatePath = filtered[0][this.form]['template'];

      this.schemaService.getSchemas().subscribe((res) => {
        this.responseData = res;
        this.formSchema.fieldsets.forEach(fieldset => {

          this.checkProperty(fieldset);
          this.definations = this.responseData.definitions;
          this.entityName = fieldset.definition;
          // this.property = this.definations[fieldset.definition].properties;

        });
        this.schema["type"] = "object";
        this.schema["title"] = this.formSchema.title;
        this.schema["definitions"] = this.definations;
        this.schema["properties"] = this.responseData.definitions[this.entityName].properties;
        this.schema["required"] = this.responseData.definitions[this.entityName].required;
        this.loadSchema();
        // this.disableInputField();

      });

    }
      ,
       (error) => {
        this.toastMsg.error('error', 'forms.json not found in src/assets/config/ - You can refer to examples folder to create the file')
      }
    )
  }


  loadSchema() {
    this.form2 = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];
    this.schemaloaded = true;
  }

  checkProperty(fieldset) {
    //  this.definations[fieldset.definition] = this.responseData.definitions[fieldset.definition];
    var ref_properties = {}
    var ref_required = []
    if (fieldset.fields && fieldset.fields.length > 0) {
      fieldset.fields.forEach(reffield => {

        if (reffield.required) {
          ref_required.push(reffield.name)
        }

        ref_properties[reffield.name] = this.responseData.definitions[fieldset.definition].properties[reffield.name];
      });

      // if (this.responseData.definitions[fieldset.definition].properties.hasOwnProperty(reffield.name)) {
      //   this.responseData.definitions[fieldset.definition].properties[reffield.name].properties = ref_properties;
      // } else {
      //   this.responseData.definitions[fieldset.definition].properties = ref_properties;

      // }
      this.responseData.definitions[fieldset.definition].properties = ref_properties;
      this.responseData.definitions[fieldset.definition].required = ref_required;
    }

  }

  disableInputField(): void {
    const form = document.getElementById('myForm');
    const labels = document.getElementsByTagName('label');
    const labelArray = Array.from(labels);
    for (const label of labelArray) {
      if (label.textContent === ' Email Id or Mobile number ') {
        const elements = document.getElementsByClassName('ng-pristine');
        const inputClass = label.getAttribute('for');
        const input = form.querySelector(`.${inputClass}`);

        if (elements) {
          this.flag = true;
          elements['disabled'] = true;
        } else {
          console.log(`Input element with id "${inputClass}" not found.`);
        }

        break;
      }
    }
  }



  getIssuer() {
    this.generalService.getData('Issuer').subscribe((res) => {
      this.issuerInfo = res[0];
      this.model = res[0];
      this.editedIssuerInfo = { ...this.issuerInfo };
    });

  }

  getDocument() {
    let payout = {
      "filters": {}
    }
    this.generalService.getData('Schema').subscribe((res) => {
      console.log(res);
      this.templatesItems = res;
    });
  }

  openPreview() {
  }

  closePops() {
    this.isOpen = false;
    this.modal = document.getElementById("prewiewProfile");
    this.modal.style.display = "none";
    const modalBackdrop = document.querySelector('.modal-backdrop.fade.show');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }


  submit() {
    this.generalService.putData('/Issuer', this.model['osid'], this.model).subscribe((res) => {
      this.temp = res;
      console.log(this.temp);
      if (res.params.status == 'SUCCESSFUL') {
        this.editedIssuerInfo = { ...this.issuerInfo };
      } else if (res.params.errmsg != '' && res.params.status == 'UNSUCCESSFUL') {
        this.toastMsg.error('error', res.params.errmsg);
      }
    }, (err) => {
      this.toastMsg.error('error', err.error.params.errmsg);
    }, () => {
      this.closePops();
    });
  }


}
