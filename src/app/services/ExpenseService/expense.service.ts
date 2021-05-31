import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Expense } from 'src/app/models/expense';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  expense: Observable<Expense[]>
  constructor(private db: AngularFirestore) { 
    this.expense = this.db.collection<Expense>('expense').valueChanges();

  }
  
  getExpense() {
    return this.expense;
  }
 
  addExpense(name,price,category,quantity,total) {
      this.db.collection("expense").add({
      date: new Date(),
      name: name,
      price: price,
      category: category,
      quantity: quantity,
      total: total
    })  
  }
  async deleteExpense(e) {
    await this.db.collection('expense').get().toPromise().then((data) =>
    // Trả về 4 document     
      data.docs.forEach(item => {
        let ele = item.data();
        if (e.name === ele['name'] && e.price === ele['price'] && e.quantity === ele['quantity']) {
          this.db.collection('expense').doc(item.id).delete();
          }                    
        })
      )
    }

  async updateExpense(prev,name,category,price,quantity) {
    await this.db.collection('expense').get().toPromise().then((data) => {
        data.docs.forEach(item => {  
          let ele = item.data();
            if (prev.name === ele['name'] && prev.price === ele['price'] && 
                prev.quantity === ele['quantity']) {
              this.db.collection('expense').doc(item.id).update({  
                name: name,
                category: category,
                price: price,
                quantity: quantity,
            })
          }
        })
    })          
  }
}
