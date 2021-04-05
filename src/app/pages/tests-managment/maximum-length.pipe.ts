import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'maximumLength'
})
export class MaximumLengthPipe implements PipeTransform {

  transform(value: string, maxLength:number): unknown {
    return value.substring(0, maxLength);
  }

}
