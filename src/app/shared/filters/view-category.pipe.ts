import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'viewCategory'
})
export class ViewCategoryPipe implements PipeTransform {

  transform(categoryName: string | undefined): unknown {

    if (categoryName == undefined)
        return "";
    
    //categoryName = categoryName.replaceAll("_", " "); //this doesn't work for Yeshua and Parnassa
    
    if (categoryName == 'yeshua_and_parnassa') //todo*: make normal titlecase for this and for names excluding ben/bat
        return 'Yeshua and Parnassa'; 

    categoryName = categoryName.charAt(0).toUpperCase() + (categoryName.slice(1, categoryName.length).toLowerCase());
    return categoryName;    
  }

}