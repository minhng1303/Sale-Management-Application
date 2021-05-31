import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Table } from 'src/app/models/table';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private afs: AngularFirestore) { }

  updateOrderList(onSelectTable) {
    console.log(onSelectTable);
    this.afs.collection<Table>('tables').get().subscribe(doc => {
      doc.forEach(item => {
        let table = item.data();
        if (table.number == onSelectTable.number) {
          this.afs.collection('tables').doc(item.id).update({  
            orderList: onSelectTable.orderList,     
            total: onSelectTable.total     
          })
        };
      })
    }) 
  }

  deleteOrderClient(onSelectTable) {
    console.log(onSelectTable);
    this.afs.collection<Table>('tables').get().subscribe(doc => {
      doc.forEach(item => {
        let table = item.data();
        if (table.number == onSelectTable.number) {
          this.afs.collection('tables').doc(item.id).update({  
            client: {}
          })
        };
      })
    }) 
  }


  updateOrderClient(onSelectTable) {
    console.log(onSelectTable);
    this.afs.collection<Table>('tables').get().subscribe(doc => {
      doc.forEach(item => {
        let table = item.data();
        if (table.number == onSelectTable.number) {
          this.afs.collection('tables').doc(item.id).update({  
            client: onSelectTable.client
          })
        };
      })
    }) 
  }

  pay(onSelectTable) {
    this.afs.collection<Table>('tables').get().subscribe(doc => {
      doc.forEach(item => {
        let table = item.data();
        if (table.number == onSelectTable.number) {
          console.log(onSelectTable);      
          this.afs.collection('tables').doc(item.id).update({
            number: onSelectTable.number,
            client: {},
            orderList: [],
            total: 0,
            point: 0,
            pointUsed: 0
          })
        };
      })
    }) 
  }
}
