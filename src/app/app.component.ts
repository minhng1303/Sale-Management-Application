import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

interface Todo {
  complete: boolean;
  id: number;
  name: string;
  description: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title: String = 'To do App';
  count: number = 5;
  todoContent = '';
  todos: any[];
  constructor(private spinner: NgxSpinnerService) {}

  ngOnInit(): void {
  
  }

      
}
