import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-drink-detail',
  templateUrl: './drink-detail.component.html',
  styleUrls: ['./drink-detail.component.css']
})
export class DrinkDetailComponent implements OnInit {
  @Input('selectedDrink') selectedDrink;
  @Input('detailMode') detailMode;
  @Output() cancelClick: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit(): void {
    console.log(this.selectedDrink);
  }

  cancel() {
    this.detailMode = false;
    this.cancelClick.emit(this.detailMode)
  }

}
