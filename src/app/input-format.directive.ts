import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appInputFormat]'
})
export class InputFormatDirective {
  @Input('appInputFormat') name: String;
  @HostListener('click') 
  onBlur() {
    console.log(this.el.nativeElement.textContent);
    // if (this.name === 'uppercase') {
    // this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase();
    // } else {
    // this.el.nativeElement.value = this.el.nativeElement.value.toLowerCase();
    // }
    // console.log(this.el);
  }
  constructor(private el: ElementRef) { 
    el.nativeElement.textContent.toUpperCase();
  }
 
}
