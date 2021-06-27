import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Drink } from '../models/drink';
import { ConfirmDialogService } from '../services/confirm-dialog.service';
import { DrinkService } from 'src/app/services/DrinkService/drink.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { FirebaseService } from '../services/firebase.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { DrinkFormComponent } from './drink-form/drink-form.component';
import { NgxSpinnerService } from 'ngx-spinner';

import { MatFormField } from '@angular/material/form-field';
import {
  state,
  trigger,
  transition,
  style,
  animation,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  animations: [
    trigger('fade', [
      transition('void => *', [style({ opacity: 0 }), animate(300)]),
    ]),
  ],
})
export class MenuComponent implements OnInit {
  filePath: String;
  drinks: Drink[];
  sortedDrink: Drink[];
  selectedDrink: Drink;
  menuForm;
  editMode = false;
  createMode: boolean = false;
  errorMessage: string = ' ';
  detailMode: boolean = false;
  itemsPerPage: number = 12;
  totalItems: number = 0;
  drinkName: string = '';
  category = ['Nước ép', 'Cà phê', 'Sữa chua', 'Trà', 'Đồ có cồn', 'Tất cả'];

  constructor(
    private drinkService: DrinkService,
    private fb: FormBuilder,
    private confirmDialog: ConfirmDialogService,
    public auth: FirebaseService,
    private dialog: MatDialog
  ) {}

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.height = '60%';
    dialogConfig.data = { drink: {}, editMode: false };
    this.dialog.open(DrinkFormComponent, dialogConfig);
  }

  ngOnInit(): void {
    this.drinkService.getDrink().subscribe((item) => {
      this.drinks = item;
      this.totalItems = item.length;
      this.sortedDrink = item;
      this.getDrinksPage(0, this.itemsPerPage);
    });
  }

  get ingredientControl() {
    return this.menuForm.controls.ingredients as FormArray;
  }

  clearErrorMessage() {
    this.errorMessage = ' ';
  }

  deleteDrink(item, e) {
    e.stopPropagation();
    e.preventDefault();
    this.confirmDialog
      .openConfirmDialog()
      .afterClosed()
      .subscribe((res) => {
        if (res) {
          this.drinkService.deleteDrink(item);
        }
      });
  }

  editDrink(item, e) {
    e.stopPropagation();
    this.selectedDrink = item;
    this.editMode = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '60%';
    dialogConfig.height = '70%';
    dialogConfig.data = { drink: this.selectedDrink, editMode: true };
    this.dialog.open(DrinkFormComponent, dialogConfig);
  }
  chooseDrink(drink) {
    this.selectedDrink = drink;
  }

  doubleClickHandler(drink) {
    console.log(drink);
  }

  getDrinksPage(page: number, itemPerPage: number): void {
    this.drinks = this.sortedDrink.slice(
      page * itemPerPage,
      page * itemPerPage + itemPerPage
    );
  }

  handlePageChange(page: number) {
    this.getDrinksPage(page, this.itemsPerPage);
  }

  @ViewChild('cat', {
    read: MatFormField,
  })
  categoryInput: MatFormField;

  searchByName() {
    console.log((this.categoryInput._control.value = ''));
    this.drinks = this.sortedDrink.filter((item) => {
      return item['name']
        .toLowerCase()
        .replace(/\s/g, '')
        .includes(this.drinkName.toLowerCase().replace(/\s/g, ''));
    });
  }

  sort(cat) {
    this.drinkName = '';
    if (cat == 'Tất cả') {
      this.drinks = this.sortedDrink;
      return;
    }
    this.drinks = this.sortedDrink.filter((item) => {
      return item.category == cat;
    });
  }
}
