import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { SingleDataSet, Label, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';
import { count } from 'rxjs/operators';
import { Order } from 'src/app/models/orders';
import { FirestoreService } from 'src/app/services/firestore.service';
import { OrderService } from 'src/app/services/OrderService/order.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.css']
})

export class PieChartComponent implements OnInit {
  orders: Order[];
  drinkList: any[] = [];
  drinkCount: any = {};
  drinkSorted: any[] = [];
  drinkResult: any[] = [];
  data:any[] = []
  constructor(private orderService: FirestoreService) {
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }
  ngOnInit() {
    let count = 1;
    this.orderService.getOrders().subscribe(res => {
      // this.orders = res;
      res.forEach(ele => {
        ele['drinks'].forEach(drink => {
          this.drinkList.push(drink.name)
        })
      })
      if (count < 2) {
        this.countDrink();
        // console.log(this.data);
        this.pieChartData = [...this.data];
        count++;
      }
    })
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
     this.calculate();
    }

    calculate() {
      for (let i = 0; i < 4; i++) {
        this.pieChartLabels.push(this.drinkResult[i].name)
        this.data.push(Number(((this.drinkResult[i].quantity/this.drinkList.length)*100).toFixed(2))) 
      }
      // this.pieChartLabels.push('other')
    }

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet = [36,27,12,9];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
}