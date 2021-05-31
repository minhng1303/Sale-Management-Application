import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Voucher } from 'src/app/models/voucher';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  private vouchers: Observable<Voucher[]>;
  constructor(public db: AngularFirestore) { 
    this.vouchers = this.db.collection<Voucher>('voucher').valueChanges();
  }
  // -------------------------------------------CLIENT INTERACTION------------------------------------------------------------
  getVoucher() {
    return this.vouchers;
  }

  addVoucher(code, value) {
    // Add a new document with a generated id.
    this.db.collection("voucher").add({
      code: code,
      value: value,
    })    
  }

  async deleteVoucher(e) {
    await this.db.collection('voucher').get().toPromise().then((data) =>
    // Trả về  document     
      data.docs.forEach(item => {
        let ele = item.data();
        if (e.code === ele['code'] && e.value === ele['value']) {
          this.db.collection('voucher').doc(item.id).delete();
          }                    
        })
      )
    }
}
