import { Pipe, PipeTransform } from '@angular/core';
import { Davener } from '../models/davener.model';

@Pipe({
    name: 'filterActive',
    pure:false
}) //this class doesn't seem to be used.  
export class FilterActivePipe implements PipeTransform {

    transform(value: Davener[], isActiveFilter: boolean): any {
      if(!value){ //if array is empty, will be considered undefined and not iterable. 
          return value;
      }
      
        const resultArray = [];
        for (const davener of value) {
            if (davener.active === isActiveFilter) {
                resultArray.push(davener);
            }
        }
        return resultArray;
    }

}
