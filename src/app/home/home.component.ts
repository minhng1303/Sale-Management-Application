import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Drink } from '../models/drink';
import { Order } from '../models/orders';
import { FirestoreService } from '../services/firestore.service';
import { debounceTime, map } from 'rxjs/operators';
import { Client } from '../models/client';
import { DrinkService } from 'src/app/services/DrinkService/drink.service'
import { ClientService } from '../services/ClientService/client.service';
import { Table } from '../models/table';
import { OrderService } from '../services/OrderService/order.service';
import { Voucher } from '../models/voucher';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchClientValue = new FormControl('',)
  searchC: boolean = false;
  searchDrinkValue = new FormControl('',)
  searchD: boolean = false;
  quantity: number = 1;
  total = 0;
  pointUsed: number = 0;
  tables: Table[] = [];
  vouchers: Voucher[] = []

  onSelectTable: Table =  {
    number: '',
    orderList: [],
    client: {},
    point: 0,
    pointUsed: 0,
    total: 0
  };
  selectedDrink: Drink;
  selectedClient: Client;
  order: Order[]; // ORDER LIST
  // DRINK LIST TAKE FROM SERVICE
  drinks: Drink[] 
  sortedDrink: Drink[];
  // CLIENT LIST TAKE FROM SERVICE
  clients: Client[];
  sortedClient: Client[];

  constructor(
    private db: FirestoreService, 
    private clientService: ClientService,
    private drinkService: DrinkService,
    private orderService: OrderService, 
    private dialog: MatDialog,
    private spinner: NgxSpinnerService) 
    {}

  ngOnInit(): void {    
    this.spinner.show()
    this.db.getTables().pipe(map((data) => {
      data.sort((a, b) => {
          return Number(a.number) < Number(b.number) ? -1 : 1;
       });
      return data;
    }))
    .subscribe(res => {
      this.tables = res;
    })

    this.drinkService.getDrink().subscribe(item => {
      this.drinks = item;
    })
    this.clientService.getClient().subscribe(item => {
      this.clients = item
    }) 
    setTimeout(() => {
      this.spinner.hide();
    }, 500)
    // ----------------------------------FUNCTION TRIGGER 2 SEARCH BAR--------------------------------------------------
     this.searchDrinkValue.valueChanges.pipe
    (debounceTime(200)
    )
    .subscribe((value) => {
        if (value.length > 0) {
          this.searchD = true;
        // this.firestoreService.getDrink().subscribe((info) => {
        this.sortedDrink = this.drinks.filter(item => {
          return (item.name.toLowerCase().replace(/\s/g, '').includes(value.toLowerCase().replace(/\s/g, '')))      
          })      
        } else this.searchD = false
        // })
    }) 

    // Search Client
    this.searchClientValue.valueChanges.pipe
    (debounceTime(200)
    )
    .subscribe((value) => {
      if (value.length > 0) {
        this.searchC = true;
        console.log(this.searchC);        
        this.sortedClient = this.clients.filter(item => {
          return (item.name.toLowerCase().replace(/\s/g, '').includes(value.toLowerCase().replace(/\s/g, '')))      
          })
        } else this.searchC = false;
      })

    }
    // ------------------------------------------------------------------------------------

    openDialog() {
      const dialogConfig = new MatDialogConfig();
      // dialogConfig.disableClose = true;
      dialogConfig.width = "60%";
      dialogConfig.height="50%";
      dialogConfig.data = this.onSelectTable;
      this.dialog.open(PaymentFormComponent,dialogConfig)
    }
  
  isOrdered(item) {
    if (item.orderList.length > 0) {
      return true
    } 
    return false
   }

  // chọn bàn 
  selectedTable(e) {
    console.log(e);
      this.onSelectTable = e;
  }

  resetClient() {
    this.onSelectTable.client = {} 
    this.orderService.deleteOrderClient(this.onSelectTable); 
  }

  chooseClient(client) {
    this.searchClientValue.setValue('');
    this.onSelectTable.client = client;
    this.orderService.updateOrderClient(this.onSelectTable)     

    }

  async chooseDrink(drink) {
    this.selectedDrink = drink;
    this.searchDrinkValue.setValue('');
    let isExist: boolean = true;
    if (this.onSelectTable.orderList.length == 0) {
      isExist = false;
    } 
    
    if (isExist) {
      for (let i = 0; i < this.onSelectTable.orderList.length; i++) {
        let ele = this.onSelectTable.orderList[i];
        if ((ele['name'] == drink['name']) && (ele['price'] == drink['price'])) {
          isExist = true
          alert('The drink is already exist')  
          return
        }
        isExist = false
        }
      }
    if (!isExist) {
      this.onSelectTable.orderList.push({
        name: drink.name,
        price: Number(drink.price),
        quantity: Number(this.quantity),
        total: drink.price * this.quantity,
        note: ''
        })
        this.onSelectTable.total = this.calculateTotalBill();
        await this.orderService.updateOrderList(this.onSelectTable);
        console.log(this.onSelectTable.number);
        }      
      }

  calculate(e, item) {
    if (e.target.value < 0) {
      e.target.value = 1
    }
    item.total = e.target.value * item.price
    this.onSelectTable.total = this.calculateTotalBill()
    this.orderService.updateOrderList(this.onSelectTable)      
  }

  deleteItem(item) {
    this.onSelectTable.orderList = this.onSelectTable.orderList.filter(ele => {
      return (item.name != ele.name && item.price != ele.price);
    })
    this.onSelectTable.total = this.calculateTotalBill();
    this.orderService.updateOrderList(this.onSelectTable);
  }

  calculateTotalBill() {
    this.total = 0;
    this.onSelectTable.orderList.forEach(item => {
        this.total += item.total
    })
    return this.total;   
  }

 
  totalRender(table) {
    let total = '';
    if (table.total > 0) {
      total = table.total;
    } else total = ' ';
    return total
  }

  addNote(value, drink) {
    console.log(value,drink);
    this.onSelectTable.orderList = this.onSelectTable.orderList.map(item => {
      if (item.name == drink.name) {
        item.note = value;
        console.log(this.onSelectTable.orderList); 
      }
      return item
    })
    this.orderService.updateOrderList(this.onSelectTable);
  } 
}

