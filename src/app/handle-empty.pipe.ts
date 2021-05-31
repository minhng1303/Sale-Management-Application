import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'handlePrice'
})
export class HandleEmptyPipe implements PipeTransform {
  // length 6 [0,1,2,3,4]
  transform(value: number): unknown {
      return value.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ".");
  }
}
    // let arr = String(value).split('')
    // if (arr.length % 2 == 0)
    // {
    //   for (let i = arr.length-1; i >= 0; i--) {
    //     if (i % 3 == 0 && i != 0 ) {
    //       arr[i] = `.${arr[i]}`
    //     }
    //   }
    // }
    // [5,0,0,0,0,0,0]
  //   if (arr.length % 2 != 0)
  //   {
  //     for (let i = arr.length-1 ; i >= 0; i--) {
  //       if ((i-1) % 3 == 0 ) {
  //         arr[i] = `.${arr[i]}`
  //       }
  //     }
  //   }
  //   return arr.join('');
  // }


