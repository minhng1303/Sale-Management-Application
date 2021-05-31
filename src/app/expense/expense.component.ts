import { Component, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Expense } from '../models/expense';
import { ConfirmDialogService } from '../services/confirm-dialog.service';
import { ExpenseService } from '../services/ExpenseService/expense.service';
import { ExpenseFormComponent } from './expense-form/expense-form.component';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.css'],
})
export class ExpenseComponent {
  expenses: Expense[];
  sortedExpense: Expense[];
  selectedExpense;
  expenseForm;
  expenseName: string = '';
  editMode = false;
  category = ['Nguyên liệu', 'Máy móc', 'Dụng cụ pha chế', 'Tất cả'];
  constructor(
    private expenseSerivce: ExpenseService,
    private fb: FormBuilder,
    private confirmDialog: ConfirmDialogService,
    private dialog: MatDialog
  ) {
    this.expenseForm = fb.group({
      name: ['', [Validators.required, Validators.maxLength(22)]],
      quantity: ['', [Validators.required]],
      price: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.expenseSerivce.getExpense().subscribe((item) => {
      this.expenses = item;
      this.sortedExpense = this.expenses.sort(
        (a, b) => b.date['seconds'] - a.date['seconds']
      ); // sort theo date
    });
  }

  @ViewChild('date', {
    read: MatInput,
  })
  dateInput: MatInput;

  sortDay(val) {
    this.dateInput.value = '';
    switch (val) {
      case 'Tất cả':
        this.sortedExpense = this.expenses.filter((item) => {
          return item;
        });
        break;
    }
  }

  handleDateChange(val, input) {
    input.checked = false;
    this.categoryInput._control.value = '';
    const day = val.value.getDate();
    const month = val.value.getMonth();
    const year = val.value.getFullYear();
    this.sortedExpense = this.expenses.filter((order) => {
      return (
        new Date(order.date['seconds'] * 1000)
          .toDateString()
          .substring(8, 10) == day &&
        new Date(order.date['seconds'] * 1000).getMonth() == month &&
        new Date(order.date['seconds'] * 1000).getFullYear() == year
      );
    });
  }

  sort(cat) {
    this.dateInput.value = '';
    this.expenseName = '';
    if (cat == 'Tất cả') {
      this.sortedExpense = this.expenses;
      return;
    }
    this.sortedExpense = this.expenses.filter((item) => {
      return item.category == cat;
    });
  }
  @ViewChild('cat', {
    read: MatFormField,
  })
  categoryInput: MatFormField;

  searchByName() {
    this.categoryInput._control.value = '';
    this.dateInput.value = '';
    this.sortedExpense = this.expenses.filter((item) => {
      return item['name']
        .toLowerCase()
        .replace(/\s/g, '')
        .includes(this.expenseName.toLowerCase().replace(/\s/g, ''));
    });
  }

  onSubmit() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.height = '70%';
    dialogConfig.data = { expense: {}, editMode: false };
    this.dialog.open(ExpenseFormComponent, dialogConfig);
  }

  deleteExpense(item) {
    this.confirmDialog
      .openConfirmDialog()
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.expenseSerivce.deleteExpense(item);
        }
      });
  }

  editExpense(item) {
    this.selectedExpense = item;
    this.editMode = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.height = '70%';
    dialogConfig.data = {
      expense: this.selectedExpense,
      editMode: this.editMode,
    };
    this.dialog.open(ExpenseFormComponent, dialogConfig);
  }
}
