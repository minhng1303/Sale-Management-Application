import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summary',
})
export class SummaryPipe implements PipeTransform {
  transform(value: string, limit: number, ...args: unknown[]): unknown {
    limit = 15;
    return value.substring(0, limit) + '...';
  }
}
