import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySymbol'
})
export class CurrencySymbolPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}


// import { Pipe, PipeTransform } from '@angular/core';
// import { CurrencyPipe } from '@angular/common';

// @Pipe({
//   name: 'currencySymbol'
// })
// export class CurrencySymbolPipe extends CurrencyPipe implements PipeTransform {

//   transform(value: string): any {
//     let currencyValue = super.transform(0, value, true, "1.0-2");
//     return currencyValue.replace(/[0-9]/g, '');
//   }


// }
