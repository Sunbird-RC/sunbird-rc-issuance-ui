import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { JSONSchema7 } from "json-schema";
import { GeneralService } from 'src/app/services/general/general.service';
import { ToastMessageService } from 'src/app/services/toast-message/toast-message.service';
import { SchemaService } from '../../services/data/schema.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
@Component({
  selector: 'app-add-records',
  templateUrl: './add-records.component.html',
  styleUrls: ['./add-records.component.scss']
})
export class AddRecordsComponent implements OnInit {
  form2: FormGroup;
  model = {};
  schemaloaded = false;
  headerName: string = 'plain'

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
  fieldKey: any;
  fieldName;
  containerName: any;
  flag: boolean = false;
  anyOfFlag: boolean = true;

  constructor(public schemaService: SchemaService,
    public toastMsg: ToastMessageService,
    public router: Router,
    private route: ActivatedRoute,
    private formlyJsonschema: FormlyJsonschema,
    public generalService: GeneralService,
    public http: HttpClient) {
    this.schemaName = this.route.snapshot.paramMap.get('document');

  }

  ngOnInit(): void {

    this.schemaService.getSchemas().subscribe((res) => {
      this.responseData = res;

      this.definations = this.responseData.definitions;
      this.property = this.definations[this.schemaName].properties;


      this.schema["type"] = "object";
      //  this.schema["title"] = this.formSchema.title;
      this.schema["definitions"] = this.definations;
      this.schema["properties"] = this.property;
      this.schema["required"] = this.definations[this.schemaName].required;
      this.schema["anyOf"] = this.definations[this.schemaName].anyOf;

      this.loadSchema();

    });


  }

  loadSchema() {
    this.form2 = new FormGroup({});
    this.options = {};
    this.fields = [this.formlyJsonschema.toFieldConfig(this.schema)];
    let tempFields = [];

    this.fields[0].fieldGroup.forEach((fieldObj, index) => {
      console.log({ fieldObj });
      this.fieldName = fieldObj.key;
      if(this.fieldName){
      tempFields[index] = this.formBuildingSingleField(fieldObj, this.fields[0].fieldGroup[index], this.schema);
      
      if (fieldObj.type == 'object') {
        this.containerName = this.fieldKey;
        this.flag = true;
        tempFields[index]['templateOptions']['label'] = fieldObj['templateOptions'].hasOwnProperty('label') ? fieldObj['templateOptions']['label'] : undefined;
        console.log(tempFields[index]['templateOptions']['label'])
        tempFields[index]['templateOptions']['description'] = fieldObj.hasOwnProperty('description') ? fieldObj['description'] : undefined;

        // if (fieldObj['templateOptions'].hasOwnProperty('label')) {
        //   tempFields[index]['wrappers'] = ['panel'];
        // }

        fieldObj.fieldGroup.forEach((sfieldObj, sIndex) => {
          fieldObj.fieldGroup[sIndex] = this.formBuildingSingleField(sfieldObj, fieldObj.fieldGroup[sIndex], this.schema['properties'][this.fieldName]);
        });
        tempFields[index]['type'] = '';
        tempFields[index]['fieldGroup'] = fieldObj.fieldGroup
        // this.schema.properties[this.fieldKey]['required'].includes();
        this.flag = false;
      }
      else if (fieldObj.type == 'array') {
      }
    }
    });


    this.fields[0].fieldGroup = tempFields;

    console.log(tempFields);

    this.schemaloaded = true;
  }


  formBuildingSingleField(fieldObj, fieldSchena, requiredF) {

    this.fieldKey = fieldObj.key;
    fieldObj['templateOptions']['label'] = this.fieldKey.charAt(0).toUpperCase() + this.fieldKey.slice(1);
    let tempObj = fieldSchena;

    
    if (!fieldObj['templateOptions'].hasOwnProperty('label') || fieldObj.templateOptions.label == undefined) {
      // let str: any = (fieldObj.templateOptions.label) ? fieldObj.templateOptions.label : fieldObj.key;


      //   let str: any = fieldObj.key;
      tempObj['label'] = this.fieldKey.charAt(0).toUpperCase() + this.fieldKey.slice(1);

      if (requiredF.hasOwnProperty('required')) {
        if (requiredF.required.includes(this.fieldKey)) {
          tempObj['templateOptions']['required'] = true;
        }
      }

    } else {

      if (fieldObj.templateOptions.label == undefined) {
        // let str: any = fieldObj.key;

        tempObj['templateOptions']['label'] = this.fieldKey.charAt(0).toUpperCase() + this.fieldKey.slice(1);
      }
    }


    // if (requiredF.hasOwnProperty('required')) {
    //   if (requiredF.required.includes(this.fieldKey)) {
    //     tempObj['templateOptions']['required'] = true;
    //   }
    // }

    if (fieldObj.templateOptions['type'] == 'enum' || fieldObj.templateOptions.hasOwnProperty('options')) {
      tempObj['type'] = (requiredF.properties.hasOwnProperty(fieldObj.key) && requiredF.properties[fieldObj.key].hasOwnProperty('fieldType')) ? requiredF.properties[fieldObj.key]['fieldType'] : 'select';
      tempObj['templateOptions']['options'] = fieldObj.templateOptions.options;
    }

    if (this.property.hasOwnProperty(this.fieldKey) && this.property[this.fieldKey].hasOwnProperty('format')) {
      tempObj['templateOptions']['type'] = this.property[this.fieldKey].format;
    }

    if (this.property.hasOwnProperty(this.fieldKey) && this.property[this.fieldKey].hasOwnProperty('placeholder')) {
      tempObj['templateOptions']['placeholder'] = this.property[this.fieldKey].placeholder;
    }

    if (fieldObj['type'] == 'string' || fieldObj['type'] == 'number') {
      tempObj['type'] = 'input';
    }

    if (fieldObj['key'] == 'number') {
      tempObj['templateOptions']['type'] = 'number';
    }

    if (this.flag) {
      if (this.schema["properties"][this.containerName]["properties"][this.fieldKey].hasOwnProperty('customMessage')) {
        fieldObj['templateOptions']['customMessage'] = this.schema["properties"][this.containerName]["properties"][this.fieldKey]['customMessage'];
      }
    }

    if (!this.flag) {
      if (this.schema["properties"][this.fieldKey].hasOwnProperty('customMessage')) {
        fieldObj['templateOptions']['customMessage'] = this.schema["properties"][this.fieldKey]['customMessage']
      }
    }

    if (this.anyOfFlag) {
      if (requiredF.hasOwnProperty('anyOf') && requiredF['anyOf']) {
        if (this.fieldKey == requiredF['anyOf'][0].required) {
          const hideExpressions = [];
          const anyOfObject = requiredF.anyOf[0];
          const propertyName = Object.keys(anyOfObject.properties)[0];
          requiredF.anyOf.forEach((condition) => {
            const expression = `model['${propertyName}'] === ${JSON.stringify(condition.properties[propertyName]['const'])}`;
            hideExpressions.push(expression);
          });
          tempObj.templateOptions['hideExpression'] = `(${hideExpressions.join(' || ')})`;
          this.anyOfFlag = false;
        }
      }
    }
    return tempObj;

    // this.fields[0].fieldGroup[0]['label'] = (fieldObj.name).toUpperCase();
  }

  submit() {
    console.log(this.model);
    this.generalService.postData('/' + this.schemaName, this.model).subscribe((res) => {

      this.router.navigate(['records/' + this.schemaName]);
    })
  }

}