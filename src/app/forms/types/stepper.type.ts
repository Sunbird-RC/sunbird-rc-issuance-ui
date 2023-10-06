import { Component } from '@angular/core';
import { FieldType, FormlyFieldConfig } from '@ngx-formly/core';

@Component({
  selector: 'formly-field-stepper',
  template: `

  <mat-horizontal-stepper labelPosition="{{field?.props?.stepperConfig?.stepslabelPosition}}">
      <mat-step [stepControl]="step" state="{{step.props?.config?.stepIcon}}" *ngFor="let step of field.fieldGroup; let index = index; let last = last">
      <ng-template matStepLabel [ngClass]="step.props?.config">
      {{ step?.props?.label }}  
    </ng-template>
    <formly-field [field]="step"></formly-field>
  
    <div class=" d-inline">
    -- {{step |json}}
   <!-- 
   <div *ngFor="let buttonL of step?.fieldGroup[index]?.props?.config?.buttons" class=" d-inline">
      <button matStepperPrevious  *ngIf="index !== 0 && buttonL?.actionType == 'back'" [ngClass]=" buttonL?.class ? 'btn  btn-outline-primary mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" type="button">{{ buttonL?.title}}</button>
  
      <button matStepperPrevious *ngIf="buttonL?.actionType == 'cancel'" [ngClass]=" buttonL?.class ? 'btn mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" type="button">{{ buttonL?.title}}</button>

      <button matStepperNext  *ngIf="!last && buttonL?.actionType == 'next'" [ngClass]=" buttonL?.class ? 'btn mx-2 btn-outline-primary' + ' ' +  buttonL?.class : 'btn btn-primary mx-2'" type="button" [disabled]="!isValid(step)">{{ buttonL?.title}} </button>

      <button matStepperNext *ngIf="buttonL?.actionType == 'skip'" [ngClass]=" buttonL?.class ? 'btn mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" type="button">{{ buttonL?.title}}</button>

      <button *ngIf="last && buttonL?.actionType == 'submit'" [ngClass]=" buttonL?.class ? 'btn mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" [disabled]="!form.valid" type="submit">{{ buttonL?.title}}</button>

      <button *ngIf="buttonL?.actionType == 'action'" [ngClass]=" buttonL?.class ? 'btn mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" type="button" [disabled]="!form.valid"> {{ buttonL?.title}}</button>

    </div>
    -->


<button matStepperNext *ngIf="!last" class="btn btn-primary" type="button" [disabled]="!isValid(step)"> Next</button>
<button matStepperPrevious *ngIf="index !== 0" class="btn btn-primary" type="button">Back</button>
<button *ngIf="last" class="btn btn-primary" [disabled]="!form.valid" type="submit">Submit</button>
   
</div>


  </mat-step>
</mat-horizontal-stepper>

  <!--  <mat-horizontal-stepper labelPosition="{{field?.props?.stepperConfig?.stepslabelPosition}}">
      <mat-step [stepControl]="step" state="{{step.props?.config?.stepIcon}}" *ngFor="let step of field.fieldGroup; let index = index; let last = last">
      <ng-template matStepLabel>
      {{ step.props.label }} 
    </ng-template>
                                                                                   
         <formly-field [field]="step"></formly-field>
       
           <div class=" d-inline">
              <div *ngFor="let buttonL of step.props?.config?.button" class=" d-inline">
        
                <button matStepperPrevious  *ngIf="index !== 0 && buttonL?.actionType == 'back'" [ngClass]=" buttonL?.class ? 'btn  btn-outline-primary mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" type="button">{{ buttonL?.title}}</button>
            
                <button matStepperPrevious *ngIf="buttonL?.actionType == 'cancel'" [ngClass]=" buttonL?.class ? 'btn mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" type="button">{{ buttonL?.title}}</button>

                <button matStepperNext  *ngIf="!last && buttonL?.actionType == 'next'" [ngClass]=" buttonL?.class ? 'btn mx-2 btn-outline-primary' + ' ' +  buttonL?.class : 'btn btn-primary mx-2'" type="button" [disabled]="!isValid(step)">{{ buttonL?.title}} </button>

                <button matStepperNext *ngIf="buttonL?.actionType == 'skip'" [ngClass]=" buttonL?.class ? 'btn mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" type="button">{{ buttonL?.title}}</button>

                <button *ngIf="last && buttonL?.actionType == 'submit'" [ngClass]=" buttonL?.class ? 'btn mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" [disabled]="!form.valid" type="submit">{{ buttonL?.title}}</button>

                <button *ngIf="buttonL?.actionType == 'action'" [ngClass]=" buttonL?.class ? 'btn mx-2' + ' ' + buttonL?.class : 'btn btn-primary mx-2'" type="button" [disabled]="!form.valid"> {{ buttonL?.title}}</button>

              </div>
          </div>
         
      </mat-step>

    

    </mat-horizontal-stepper> -->

 
  `,
})
export class FormlyFieldStepper extends FieldType {

  isValid(field: FormlyFieldConfig): boolean {
    if (field.key) {
      return field.formControl.valid;
    }

    return field.fieldGroup ? field.fieldGroup.every((f) => this.isValid(f)) : true;
  }
}
