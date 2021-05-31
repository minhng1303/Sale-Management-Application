import { Component, Inject, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormArray, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Drink } from 'src/app/models/drink';
import { DrinkService } from 'src/app/services/DrinkService/drink.service';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-drink-form',
  templateUrl: './drink-form.component.html',
  styleUrls: ['./drink-form.component.css']
})
export class DrinkFormComponent implements OnInit {
  filePath: string = '';
  drinks: Drink[] = [];
  errorMessage: string = ' '
  menuForm;
  selectedDrink: Drink = {};
  editMode: boolean = false;
  constructor(private fb: FormBuilder,
    private afStorage: AngularFireStorage, 
    private drinkService: DrinkService,
    public dialogRef: MatDialogRef<DrinkFormComponent>,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data,
    ) { 
    this.menuForm = fb.group({
      name: new FormControl('',[Validators.required, Validators.maxLength(22)]),
      price: new FormControl('',[Validators.required]),
      category: new FormControl('',[Validators.required]),
      url: new FormControl('',),
      ingredients: new FormArray([]),
      description: new FormControl('',)
    })
  }

  changeEditMode() {
    this.editMode = true;
    this.menuForm.enable();
  }

  ngOnInit(): void {    
    if (this.data.editMode) {
      this.menuForm.patchValue({
        name: this.data['drink'].name,
        price: this.data['drink'].price,
        category: this.data['drink'].category,
        // url: this.data['drink'].url,
        description: this.data['drink'].description || ''
      })
      if (this.data['drink'].ingredients) {
        this.data['drink'].ingredients.forEach(ele => {
          this.ingredientControl.push(this.fb.group({
            name: ele.name,
            quantity: ele.quantity
          }))
        })  
      }  
      this.menuForm.disable();
    }
    this.drinkService.getDrink().subscribe(item => {
      this.drinks = item;
    })
  }

  get ingredientControl() {
    return (<FormArray>this.menuForm.controls.ingredients);
  }

  cancel(e) {
    e.stopPropagation();
    e.preventDefault();
    this.onClose();
  }

  ingredientGroup() {
    return this.fb.group({
      name: new FormControl('',),
      quantity: new FormControl('',),
    })
  }

  addIngredient(e) {
    e.stopPropagation();
    e.preventDefault();
    this.ingredientControl.push(this.ingredientGroup());
  }

  deleteIngredient(index ,e) {
    e.stopPropagation();
    e.preventDefault();
    this.ingredientControl.removeAt(index);
  }

  get(name) {
    return this.menuForm['controls'][name];
  }

  onSubmit() {
    this.spinner.show();
    this.clearErrorMessage();
    let isExist: boolean = false
    this.drinks.forEach(item => {
      if (item.name == this.menuForm.value['name'] && item.price == this.menuForm.value['price']) {
        isExist = true;
      } 
    })
    if (!isExist) {
      
      let filePath = `${this.menuForm.value.category}/${this.filePath['name']}_${new Date().getTime()}`
      let fileRef = this.afStorage.ref(filePath)
      this.afStorage.upload(filePath, this.filePath).snapshotChanges().pipe(finalize(() =>{
        fileRef.getDownloadURL().subscribe((url) => { 
          this.drinkService.addDrink(
            this.menuForm.value['name'], 
            this.menuForm.value['price'],
            this.menuForm.value['category'],
            url,
            this.menuForm.value['ingredients'],
            this.menuForm.value['description'])              
            this.onClose();         
            this.spinner.hide();
          })
      })).subscribe()
      return
    } 
    this.errorMessage = 'The drink is already exist';   
  }

  async updateDrink(e) {
    e.stopPropagation();
    e.preventDefault();
    if (this.filePath == '') {
      console.log('hello2');
        console.log(this.menuForm.value);
      this.drinkService.updateDrink(this.data['drink'],
        this.menuForm.value['name'], 
        this.menuForm.value['price'],
        this.menuForm.value['category'],
        this.data['drink'].url,
        this.menuForm.value['ingredients'],
        this.menuForm.value['description'])
      this.onClose();
      return
    }
    let filePath = `${this.menuForm.value.category}/${this.filePath['name']}_${new Date().getTime()}`
    let fileRef = this.afStorage.ref(filePath)
    this.afStorage.upload(filePath, this.filePath).snapshotChanges().pipe(finalize(() =>{
      fileRef.getDownloadURL().subscribe((url) => {       
        this.drinkService.updateDrink(this.selectedDrink,
            this.menuForm.value['name'], 
            this.menuForm.value['price'],
            this.menuForm.value['category'],
            url,
            this.menuForm.value['ingredients'],
            this.menuForm.value['description'])
          this.onClose();
        })
    })).subscribe()
  }

  onClose() {
    this.menuForm.reset();
    this.ingredientControl.clear();   
    this.dialogRef.close();
  }
  
  clearErrorMessage() {
    this.errorMessage = ' ';
  }

  upload(event) {    
    this.filePath = event.target.files[0] 
  }
}
