import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Voucher } from '../models/voucher';
import { ConfirmDialogService } from '../services/confirm-dialog.service';
import { VoucherService } from '../services/VoucherService/voucher.service';

@Component({
  selector: 'app-voucher',
  templateUrl: './voucher.component.html',
  styleUrls: ['./voucher.component.css']
})
export class VoucherComponent implements OnInit {
  voucherForm;
  vouchers: Voucher[] = [];
  errorMessage: string = '';
  constructor(private voucherService: VoucherService, private fb: FormBuilder, private confirmDialog: ConfirmDialogService) {
    this.voucherForm = fb.group({
        code: ['',[Validators.required,Validators.maxLength(20)]],
        value: ['',[Validators.required,Validators.max(100), Validators.min(1)]],
      })
    }

   ngOnInit(): void {
    this.voucherService.getVoucher().subscribe(item => {
      this.vouchers = item;
      })
    }

    get(name) {
      return this.voucherForm['controls'][name];
    }

    onSubmit() {
      this.clearErrorMessage();
      let isExist: boolean = false
      this.vouchers.forEach(item => {
        if (item.code == this.voucherForm.value['code']) {
          isExist = true;
        } 
      })
      if (!isExist) {
        this.voucherService.addVoucher(this.voucherForm.value['code'], this.voucherForm.value['value']);
        this.voucherForm.reset();
        return
      } this.errorMessage = 'The voucher code number is already exist'; 
    }

    clearErrorMessage() {
      this.errorMessage = ' ';
    }

    log() {
      console.log(this.voucherForm);
    }

    deleteClient(item) {
      this.confirmDialog.openConfirmDialog().afterClosed().subscribe(res => {
        if (res) {
          this.voucherService.deleteVoucher(item);
        }
      })
    }
}
