import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css'],
})
export class ButtonComponent implements OnInit {
  @Input() name: String;
  @Output('handle') handle: EventEmitter<any> = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  clickHandler(): void {
    this.handle.emit('data');
  }
}
