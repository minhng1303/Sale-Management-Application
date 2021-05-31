import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { Order } from 'src/app/models/orders';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
  orders: Order[];
  orderByMonth = [ [], [], [], [], [], [], [], [], [], [], [], [] ];
  saleByMonth = [];
  monthLabel = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label = [...this.monthLabel];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [
    { data: [], 
      label: 'Doanh thu tháng' 
    }
  ];
  constructor(private orderService: FirestoreService) { }
  
  ngOnInit() {
    let count = 0;
    this.orderService.getOrders().subscribe(res => {
      this.orders = res; 
      if (count < 1) {
        this.getMonthSale();
        count++;
      }      
    })
  }
  
  getMonthSale() {
    this.orders.forEach(order => {
      let month = new Date(order.date['seconds']*1000).getMonth();
      this.orderByMonth[month].push(order.totalSpent);
    })
    this.orderByMonth.forEach(month => {
        const sum = month.reduce((acc,val) => {
            return acc + val
          }, 0)
        this.saleByMonth.push(sum);
        this.barChartData[0].data.push(sum);
      })      
  }
}

