import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Client } from '../models/client';
import { Drink } from '../models/drink';
import { Order } from '../models/orders';
import { Table } from '../models/table';
import { Voucher } from '../models/voucher';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  clients: Observable<Client[]>;
  drinks: Observable<Drink[]>
  orders: Observable<Order[]>
  tables: Observable<Table[]>;
  vouchers: Observable<Voucher[]>
  orderID;
  constructor(public db: AngularFirestore) {
    this.orders = this.db.collection<Order>('orders').valueChanges();
    this.tables = this.db.collection<Table>('tables').valueChanges();
    this.vouchers = this.db.collection<Voucher>('voucher').valueChanges();
 }

  // -------------------------------ORDER INTERACTION------------------------------------------------------

  getTables() {
    return this.tables;
  }

  getOrders() {
    return this.orders;
  }

  getVouchers() {
    return this.vouchers;
  }

  addOrders(item) {
    // thêm 1 order vào history
    this.db.collection('orders').add({
      date: new Date(),
      client: item.client,
      table: item.number,
      totalSpent: item.total,
      savedPoint: Math.floor(item.total * 0.00005),
      pointUsed: item.pointUsed,
      cash: item.total - item.pointUsed*1000,
      drinks: item.orderList
    })
    
    // update điểm khách hàng và tổng chi tiêu sau khi ẩn pay
    this.db.collection('client').get().toPromise().then((data) => {
      data.docs.forEach(doc => {  
        let ele = doc.data();
          if (item.client.name === ele['name'] && item.client.phone === ele['phone']) {
            this.db.collection('client').doc(doc.id).update({  
              point: ele['point'] +  Math.floor(item.total * 0.00005),
              totalSpent: ele['totalSpent'] + item.total,
          })
        }
      })
    })
  }
  // --------------------------ADD REGISTRATION-------------------------------------------------------
}

    

 