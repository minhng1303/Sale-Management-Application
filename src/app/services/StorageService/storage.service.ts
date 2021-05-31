import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Ingredient } from 'src/app/models/ingredient';
import { FirestoreService } from '../firestore.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  ingredient: Observable<Ingredient[]>;
  
  constructor(private db: AngularFirestore) {
    this.ingredient = this.db.collection<Ingredient>('storage').valueChanges()
  }
  
  addItem(form) {
    this.db.collection('storage').add({
      name: form.value.name,
      category:form.value.category,
      quantity:form.value.quantity,
      unit: form.value.unit,
      price:form.value.price,
      total: form.value.price * form.value.quantity
    })
  }

  getItem() {
    return this.ingredient;
  }

  async updateIngredient(prev, form) {
    await this.db.collection('storage').get().subscribe((data) => {
      data.docs.forEach(item => {  
        let ele = item.data();
          if (prev.name == ele['name'] && 
              prev.price == ele['price'] && 
              prev.category == ele['category'] && 
              prev.unit == ele['unit']) 
              {
                console.log(item.data());
                
                this.db.collection('storage').doc(item.id).update({  
                  name: form.name,
                  price: form.price,
                  category: form.category,
                  quantity: form.quantity,
                  unit: form.unit,
                  total: form.quantity * form.price
              })
            }
          })
      }) 
  }

  async deleteIngredient(e) {
    await this.db.collection('storage').get().subscribe(data =>
    // Trả về 4 document     
      data.docs.forEach(item => {
        let ele = item.data();
        if (e.name === ele['name'] && 
            e.price === ele['price'] && 
            e.category === ele['category'] && 
            e.unit == ele['unit']) {
          this.db.collection('storage').doc(item.id).delete();
          }                    
        })
      )
  }
}
