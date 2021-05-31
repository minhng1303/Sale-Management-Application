import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Drink } from '../../models/drink';

@Injectable({
  providedIn: 'root'
})
export class DrinkService {

  drinks: Observable<Drink[]>
  constructor(private db: AngularFirestore) { 
    this.drinks = this.db.collection<Drink>('drinks').valueChanges();

  }
  
  getDrink() {
    return this.drinks;
  }
 
  addDrink(name,price,cate,url,ingre,des) {
      this.db.collection("drinks").add({
      name: name,
      price: price,
      category: cate,
      url: url,
      ingredients: ingre,
      description: des
    })  
  }
  async deleteDrink(e) {
    await this.db.collection('drinks').get().toPromise().then((data) =>
    // Trả về 4 document     
      data.docs.forEach(item => {
        let ele = item.data();
        if (e.name === ele['name'] && e.price === ele['price'] && e.category === ele['category']) {
          this.db.collection('drinks').doc(item.id).delete();
          }                    
        })
      )
    }

  async updateDrink(prev,name,price,category,url,ingre,des) {
    await this.db.collection('drinks').get().toPromise().then((data) => {
        data.docs.forEach(item => {  
          let ele = item.data();
            if (prev.name === ele['name'] && prev.price === ele['price'] && prev.category === ele['category']) {
              this.db.collection('drinks').doc(item.id).update({  
                name: name,
                price: Number(price),
                category: category,
                url: url,
                ingredients: ingre,
                description: des
            })
          }
        })
    })          
  }
}
