import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { Order } from '../models/orders';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.css'],
})
export class TodosComponent implements OnInit {
  count: number = 0;
  orders: Order[];
  selectedOrder: Order = {
    table: '',
    totalSpent: 0,
    pointUsed: 0,
    savedPoint: 0,
    drinks: [],
    date: new Date(),
  };
  isShow: boolean = false;
  sortedOrder;
  customerName: string;
  dataSource: any;
  orderID;
  detailMode: boolean = false;
  constructor(private db: FirestoreService, private route: Router) {}

  ngOnInit(): void {
    this.db.getOrders().subscribe((data) => {
      // data['date'].toDateString();
      this.orders = data;
      this.sortedOrder = this.orders.sort(
        (a, b) => b.date['seconds'] - a.date['seconds']
      ); // sort theo date
    });
  }

  showOrderList(val) {
    this.route.navigate(['history', val.date.seconds]);
  }

  searchByName() {
    this.sortedOrder = this.orders.filter((item) => {
      if (item.client['name']) {
        return item.client['name']
          .toLowerCase()
          .replace(/\s/g, '')
          .includes(this.customerName.toLowerCase().replace(/\s/g, ''));
      }
    });
  }

  showDetail(order) {
    if (this.detailMode == true) {
      this.detailMode = false;

      return;
    }
    this.detailMode = true;
    this.selectedOrder = order;
  }

  @ViewChild('date', {
    read: MatInput,
  })
  dateInput: MatInput;

  sort(val) {
    this.dateInput.value = '';
    switch (val) {
      case 'Tất cả':
        this.sortedOrder = this.orders.filter((item) => {
          return item;
        });
        break;
    }
  }

  handleDateChange(val, input) {
    input.checked = false;
    const day = val.value.getDate();
    const month = val.value.getMonth();
    const year = val.value.getFullYear();
    this.sortedOrder = this.orders.filter((order) => {
      return (
        new Date(order.date['seconds'] * 1000)
          .toDateString()
          .substring(8, 10) == day &&
        new Date(order.date['seconds'] * 1000).getMonth() == month &&
        new Date(order.date['seconds'] * 1000).getFullYear() == year
      );
    });
  }
}
