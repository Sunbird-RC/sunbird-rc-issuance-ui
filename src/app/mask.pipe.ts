import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mask'
})
export class MaskPipe implements PipeTransform {

  transform(value: string, startIndex: number=0 ,endIndex : number=100): string { 

    if(startIndex == 0 && endIndex !=100){
      let maskedSection = value.slice(startIndex, endIndex);

      let visibleSection = value.slice(endIndex);
      return maskedSection.replace(/./g, '*') + visibleSection;
    }
     else if(startIndex > 0){
      let unmaskedSection = value.slice(0, startIndex);
      let maskedSection= value.slice(startIndex, endIndex);
      let visibleSection = value.slice(endIndex);
      return unmaskedSection + maskedSection.replace(/./g, '*') + visibleSection;

     }
     else if(startIndex==0 && endIndex ==100){ 
      let maskedSection = value.slice(0, 4);
      let visibleSection = value.slice(4,value.length);
      return maskedSection.replace(/./g, '*') + visibleSection;
     
     }
  }

}
