import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Voucher } from 'src/app/models/voucher';
import { FirestoreService } from 'src/app/services/firestore.service';
import { OrderService } from 'src/app/services/OrderService/order.service';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {
  vouchers: Voucher[];
  paymentForm;
  selectedTable;
  voucherValue: number = 0;
  pointValue: number = 0;
  pointMessage: string = '';
  voucherMessage: string = ''
  voucherDiscount: string = '';
  

  constructor(private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private db: FirestoreService,
    private orderService: OrderService,
    public dialogRef: MatDialogRef<PaymentFormComponent>) {
    this.selectedTable = data;
   }

  ngOnInit(): void {
    this.db.getVouchers().subscribe(res => {
      this.vouchers = res;    
    })
  }

  checkPoint(point) {
    let valid = false;
    if (point < 0) {
      this.pointMessage = 'Điểm không được âm'
    } else if (point > this.selectedTable.client.point) {
      this.pointMessage = 'Điểm quá lớn'
    } else {
      this.pointMessage = ''
      valid = true
    }
    // console.log(valid);
    return valid
  }

  calculatePoint(point) {
    if (point && this.checkPoint(point)) {
      this.pointValue = point*1000;
      this.calculateTotal()
    } else {
      this.pointValue = 0;
    }
    return this.pointValue
  }
  
  calculateVoucher(voucher) {
    this.clearVoucherMessage();
    let usedVoucher = {};
    if (voucher) {
      this.vouchers.map(item => {
        if (item.code == voucher) {
          usedVoucher = item
        }
      })
      if (!Boolean(usedVoucher['code'])) {
        this.voucherMessage = 'mã không hợp lệ'
      }
      if (Boolean(usedVoucher['code'])) {
        this.voucherMessage = '';
        this.voucherDiscount = String(usedVoucher['value'])        
        this.voucherValue = this.selectedTable.total/100*usedVoucher['value']
        this.calculateTotal()
      }
      return
    }
  }

  calculateTotal() {
    let total = this.selectedTable.total - this.voucherValue - this.pointValue;
    return total
  }

  get(name) {
    return this.paymentForm['controls'][name];
  }

  clearPointMessage() {
    this.pointMessage = ''
  }

  clearVoucherMessage() {
    this.voucherMessage = ''
  }

  async pay() {
    this.selectedTable.pointUsed = this.pointValue/1000
    await this.db.addOrders(this.selectedTable);
    await this.orderService.pay(this.selectedTable)
    this.onClose();
  }

  cancel(e) {
    e.stopPropagation()
    e.preventDefault()
    this.onClose();
  }

  onClose() {
    this.dialogRef.close();
  }

}
