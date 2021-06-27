import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Order } from 'src/app/models/orders';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Label } from 'ng2-charts';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-day-chart',
  templateUrl: './day-chart.component.html',
  styleUrls: ['./day-chart.component.css'],
})
export class DayChartComponent implements OnInit {
  orders: Order[];
  orderByDay = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ];
  saleByMonth = [];
  saleByDay = [];
  monthLabel = [];
  dayLabel = [];
  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];
  barChartData: ChartDataSets[] = [{ data: [], label: 'Doanh thu ngày' }];
  constructor(
    private orderService: FirestoreService,
    private firebase: FirebaseService
  ) {}

  ngOnInit() {
    this.barChartLabels = [...this.getDay];
    let count = 0;
    this.orderService.getOrders().subscribe((res) => {
      this.orders = res.filter((order) => {
        return new Date(order.date['seconds'] * 1000).getMonth() == 5;
      });
      if (count < 1) {
        this.getDaySale();
        this.getTodayRevenue();
        count++;
      }
    });
  }

  getDaySale() {
    this.orders.forEach((order) => {
      let day = new Date(order.date['seconds'] * 1000).getDate();
      this.orderByDay[day - 1].push(order.totalSpent);
    });
    this.orderByDay.forEach((day) => {
      const sum = day.reduce((acc, val) => {
        return acc + val;
      }, 0);
      this.saleByDay.push(sum);
      this.barChartData[0].data.push(sum);
    });
  }

  getTodayRevenue() {
    let today = new Date();
    let [non, dd] = String(today.getDate()).padStart(2, '0').split('');
    this.firebase.setRevenue(this.saleByDay[Number(dd) - 1]);
  }

  get getDay() {
    let count = 1;
    while (count < 32) {
      this.dayLabel.push(String(count) + '/6');
      count++;
    }
    return this.dayLabel;
  }
}
