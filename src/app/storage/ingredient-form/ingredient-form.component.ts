import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StorageService } from 'src/app/services/StorageService/storage.service';

@Component({
  selector: 'app-ingredient-form',
  templateUrl: './ingredient-form.component.html',
  styleUrls: ['./ingredient-form.component.css']
})
export class IngredientFormComponent implements OnInit {
  storageForm;
  errorMessage: string = '';
  ingredientList = [];
  selectedIngredient: string = '';
  editMode: boolean;
  category = ['Hoa quả','Cà phê','Sữa chua','Trà','Đồ có cồn','Siro','Đồ uống có ga','Tất cả'];
  constructor(private storageService: StorageService, private fb: FormBuilder,
    public dialogRef: MatDialogRef<IngredientFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {
    // this.selectedIngredient = data['ingredient']
    // this.editMode = data['editMode']
    this.storageForm = fb.group({
      name: ['',[Validators.required,Validators.maxLength(20)]],
      price: ['',[Validators.required]],
      category: ['',[Validators.required]],
      quantity: ['',Validators.required],
      unit: ['',[Validators.required]]
    })
    if (this.data.editMode) {
        this.storageForm.patchValue({
        name: data['ingredient'].name,
        price: data['ingredient'].price,
        category: data['ingredient'].category,
        quantity: data['ingredient'].quantity,
        unit: data['ingredient'].unit
      })
    }
   }

  ngOnInit(): void {
    this.storageService.getItem().subscribe(res => {
      this.ingredientList = res;
    })
  }

  onClose() {
    this.storageForm.reset();
    this.dialogRef.close();
  }

  onSubmit() {
    // this.storageService.addItem(this.storageForm);
    let isExist: boolean = false
    this.ingredientList.forEach(item => {
      if (item.name.toLowerCase() == this.storageForm.value['name'].toLowerCase()) {
        isExist = true;
      } 
    })
    if (!isExist) {
      this.storageService.addItem(this.storageForm);
    } else {
      this.errorMessage = 'Nguyên liệu đã tồn tại'
    };   
    this.onClose();
  }

  get(name) {
    return this.storageForm['controls'][name];
  }

  clearErrorMessage() {
    this.errorMessage = ' ';
  }

  async updateItem(e, ingre) {
    console.log(ingre);
    console.log(this.storageForm.value);
    e.stopPropagation();
    e.preventDefault()    
    await this.storageService.updateIngredient(ingre, this.storageForm.value);    
    this.onClose();
  }

  cancel(e) {
    e.stopPropagation();
    e.preventDefault()
    this.onClose();
  }
}
