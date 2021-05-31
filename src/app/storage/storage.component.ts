import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Ingredient } from '../models/ingredient';
import { ConfirmDialogService } from '../services/confirm-dialog.service';
import { DrinkService } from '../services/DrinkService/drink.service';
import { StorageService } from '../services/StorageService/storage.service';
import { IngredientFormComponent } from './ingredient-form/ingredient-form.component';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {
  ingredientName: string = ''
  ingredientList: Ingredient[];
  sortedList: Ingredient[];
  storageForm;
  selectedIngredient: Ingredient;
  errorMessage: string;
  editMode: boolean = false;
  category = ['Hoa quả','Cà phê','Sữa chua','Trà','Đồ có cồn','Siro','Đồ uống có ga','Tất cả'];
  constructor(private confirmDialog: ConfirmDialogService,
              private storageService: StorageService,
              private dialog: MatDialog) {
   }

  ngOnInit(): void {
    this.storageService.getItem().subscribe(res => {
      this.ingredientList = res;
      this.sortedList = res;
    })
  }

  deleteItem(item,e) {
    e.stopPropagation();
    this.confirmDialog.openConfirmDialog().afterClosed().subscribe(res => {
      if (res) {
        this.storageService.deleteIngredient(item);
      }
    })
  }

  editItem(item,e) {
    e.stopPropagation();
    this.selectedIngredient = item;
    this.editMode = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "60%";
    dialogConfig.height="45%";
    dialogConfig.data = {ingredient: item, editMode: this.editMode}
    this.dialog.open(IngredientFormComponent,dialogConfig)
   
  }

  sort(cat) {     
    if (cat == 'Tất cả') {
      this.ingredientList = this.sortedList
      return
    }
    this.ingredientList = this.sortedList.filter(item => {
      return item.category == cat
    })
  }

  searchByName() {
    this.ingredientList = this.sortedList.filter(item => {
        return (item['name'].toLowerCase().replace(/\s/g, '')).includes(this.ingredientName.toLowerCase().replace(/\s/g, ''));      
    })
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = "60%";
    dialogConfig.height="45%";
    dialogConfig.data = {ingredient: {}, editMode: false}
    this.dialog.open(IngredientFormComponent,dialogConfig)
  }
  
}
