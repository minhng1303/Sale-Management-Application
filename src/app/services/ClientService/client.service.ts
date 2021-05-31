import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Client } from 'src/app/models/client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  clients: Observable<Client[]>;
  constructor(public db: AngularFirestore) { 
    this.clients = this.db.collection<Client>('client').valueChanges();
  }
  // -------------------------------------------CLIENT INTERACTION------------------------------------------------------------
  getClient() {
    return this.clients;
  }

  addClient(name, phone,id) {
    // Add a new document with a generated id.
    this.db.collection("client").add({
      name: name,
      phone: phone,
      id: id,
      totalSpent: 0,
      point: 0,
    })    
  }

  async deleteClient(e) {
    await this.db.collection('client').get().toPromise().then((data) =>
    // Trả về  document     
      data.docs.forEach(item => {
        let ele = item.data();
        if (e.name === ele['name'] && e.phone === ele['phone'] && e.phone === ele['phone']) {
          this.db.collection('client').doc(item.id).delete();
          }                    
        })
      )
    }

  async updateClient(prev,name,phone) {
    await this.db.collection('client').get().toPromise().then((data) => {
        data.docs.forEach(item => {  
          let ele = item.data();
            if (prev.name === ele['name'] && prev.phone === ele['phone']) {
              this.db.collection('client').doc(item.id).update({  
                name: name,
                phone: phone,
            })
          }
        })
    })          
  }
}
