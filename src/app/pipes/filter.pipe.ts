import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any[], field : string, value : string): any[] {  
    if (!items) return [];
    if (!value || value.length == 0) return items;
    return items.filter(ele => 
     {
    

       if(ele[field].toLowerCase().includes(value.toLocaleLowerCase())){
         return true;
       }else{
         return false;
       }
    })
  }
}
