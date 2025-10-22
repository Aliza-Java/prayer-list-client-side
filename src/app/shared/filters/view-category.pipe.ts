import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'viewCategory'
})
export class ViewCategoryPipe implements PipeTransform {

  transform(categoryName: string | undefined): unknown {

    if (categoryName == undefined)
        return "";
    
    categoryName = categoryName.charAt(0).toUpperCase() + (categoryName.slice(1, categoryName.length).toLowerCase());
    return categoryName;    
  }

}