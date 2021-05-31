import { Component, OnInit } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Order } from '../models/orders';
import { Table } from '../models/table';
import { FirebaseService } from '../services/firebase.service';
import { FirestoreService } from '../services/firestore.service';
import { OrderService } from '../services/OrderService/order.service';

@Component({
  selector: 'app-revenue',
  templateUrl: './revenue.component.html',
  styleUrls: ['./revenue.component.css']
})
export class RevenueComponent implements OnInit {
  orders: Order[];
  drinkList: any[] = [];
  drinkCount: any = {};
  drinkSorted: any[] = [];
  drinkResult: any[] = [];
  data:any[] = []
  tables: Table[] = [];
  activeTable: number = 0;
  todayRevenue: number = 0;
  orderByDay = [];
  orderTwoDay = [];
  saleByDay = [];
  pointToday = [];
  pointValue: number = 0;

  constructor(private orderService: FirestoreService, private firebase: FirebaseService,
    private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show()
    setTimeout(() => {
      this.spinner.hide();
    }, 500)
    let count = 1;
    this.orderService.getOrders().subscribe(res => {
      res.forEach(ele => {
        ele['drinks'].forEach(drink => {
          for (let i = 0; i < drink.quantity; i++) {
            this.drinkList.push(drink.name)            
          }
        })
      })
      if (count < 2) {
        this.countDrink();
        let today = new Date();
        let dd = String(today.getDate()).padStart(2, '0') 
        res.forEach(order => {
          let day = new Date(order.date['seconds']*1000).getDate();
          let month = new Date(order.date['seconds']*1000).getMonth()
          if (day == Number(dd) && month == 4) {
            this.orderByDay.push(order.totalSpent);            
            this.pointToday.push(order.pointUsed)
          }
          if ((day == Number(dd) || day == (Number(dd)-1)) && month == 4) {
            this.orderTwoDay.push(order)
          }
        })
      this.todayRevenue = this.getTodaySale()
      this.pointValue = this.getTodayPoint(this.pointToday);
      // -----------------------------------------------
      this.orderService.getTables().subscribe(res => {
        res.forEach(table => {               
          if (table.orderList.length > 0) {
            this.activeTable++;
          }
        })        
      })
      count++;  
      }
    })
  }

  getTodayPoint(arr) {
    console.log(arr);
    const sum = arr.reduce((total,item) => {
      return total + item
    },0)
    return sum
  }

  getTodaySale() {
    const sum = this.orderByDay.reduce((acc,val) => {
        return acc + val
      }, 0)
      return sum
    }

  countDrink() {
    let arr = this.drinkList;
    for (let i = 0; i <arr.length; i++) {
      if (!Object.getOwnPropertyNames(this.drinkCount).toString().includes(arr[i])) {
        let count = 0;
        for (let j = 0;j< arr.length; j++) {
          if (arr[i] == arr[j]) {
            count++;
          }
        }
        this.drinkCount[`${arr[i]}`] = count;
      }
    }
    console.log(this.drinkCount, arr.length);
    
    this.sortDrink();
  }

  sortDrink() {
    for (let drink in this.drinkCount) {
      this.drinkSorted.push([drink, this.drinkCount[drink]]);
    }
  
    this.drinkSorted.sort((a, b) => {
      return b[1] - a[1];
     });

     this.drinkSorted.map(ele => {  
      this.drinkResult[this.drinkSorted.indexOf(ele)] = {
        name: ele[0],
        quantity: ele[1]
      }
     })
    }
}
