import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FirestoreService } from '../services/firestore.service';

interface Bill {
  name: string;
  price: number;
  quantity: number;
  total: number;
  note: string;
}
@Component({
  selector: 'app-todo-detail',
  templateUrl: './todo-detail.component.html',
  styleUrls: ['./todo-detail.component.css'],
})
export class TodoDetailComponent implements OnInit {
  orderDetail: Bill[];
  @Input('selectedOrder') selectedOrder;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private db: FirestoreService
  ) {}

  ngOnInit(): void {
    this.orderDetail = this.selectedOrder.drinks;
  }

  goBack(): void {
    // this.router.navigateByUrl('/todos');
    this.router.navigate(['/history']);
    this.location.back();
  }
}
