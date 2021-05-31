import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Expense } from 'src/app/models/expense';
import { ExpenseService } from 'src/app/services/ExpenseService/expense.service';

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit {
  expenseForm;
  selectedExpense: Expense;
  errorMessage: string = '';
  category = ['Nguyên liệu','Máy móc','Dụng cụ pha chế','Trang trí'];
  constructor(private fb: FormBuilder, private expenseService: ExpenseService,
    public dialogRef: MatDialogRef<ExpenseFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    console.log(this.data);
    
    this.expenseForm = fb.group({
      name: ['', [Validators.required, Validators.maxLength(22)]],
      quantity: ['',],
      category: ['',Validators.required],
      price: ['', [Validators.required]],
    });
   
    if (this.data['expense']) {
      this.expenseForm.patchValue({
        name: this.data['expense'].name,
        quantity: this.data['expense'].quantity,
        category: this.data['expense'].category,
        price: this.data['expense'].price,
      })     
   }   
   }

  ngOnInit(): void {

  }

  get(name) {
    return this.expenseForm['controls'][name];
  }

  get checkToTal() {
    let val = this.expenseForm.value['quantity']*this.expenseForm.value['price']; 
    if (val == 0) {
      return this.expenseForm.value['price']
    }
    return val;
  }

  get checkQuantity() {
    let val = this.expenseForm.value['quantity'];
    if (val == 0) {
      return ''
    }
    return val
  }

  
  onSubmit() {       
    this.expenseService.addExpense(
      this.expenseForm.value['name'],
      this.expenseForm.value['price'],
      this.expenseForm.value['category'],
      this.checkQuantity,
      this.checkToTal);
    this.onClose();
  }

  async updateExpense(prev) {
    prev = this.selectedExpense;
    await this.expenseService.updateExpense(
      prev,
      this.expenseForm.value['name'],
      this.expenseForm.value['category'],
      this.expenseForm.value['quantity'],
      this.expenseForm.value['price'],
    );
    this.onClose();
  }

  cancel(e) {
    e.stopPropagation();
    e.preventDefault();
    this.onClose()
  }
  
  log() {
    console.log(this.expenseForm);
  }

  onClose() {
    this.expenseForm.reset();  
    this.dialogRef.close();
  }

  
}
