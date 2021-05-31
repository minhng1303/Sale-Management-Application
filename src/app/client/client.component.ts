import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Client } from '../models/client';
import { ConfirmDialogService } from '../services/confirm-dialog.service';
import { ClientService } from '../services/ClientService/client.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css']
})
export class ClientComponent implements OnInit {
  clients: Client[];
  sortedClients: Client[];
  selectedClient;
  editMode = false;

  constructor(private clientService: ClientService, 
              private fb: FormBuilder,
              private confirmDialog: ConfirmDialogService,
              private spinner: NgxSpinnerService) {
    }

   ngOnInit(): void {
     this.spinner.show()
    setTimeout(() => {
      this.spinner.hide();
    }, 300)
    this.clientService.getClient().pipe(map((data) => {
      data.sort((a, b) => {
          return Number(a.id) < Number(b.id) ? -1 : 1;
       });
      return data;
      })).subscribe(item => {
      this.clients = item;
      this.sortedClients = item;      
      })
    }

    handleSearch(e) {
      this.clients = e;
    }

    handleUpdate(e) {
      this.editMode = e;
    }

    deleteClient(item) {
      this.confirmDialog.openConfirmDialog().afterClosed().subscribe(res => {
        if (res) {
          this.clientService.deleteClient(item);
        }
      })
    }

    editClient(item) {
      this.selectedClient = item;
      this.editMode = true;    
    }
  }

  
    
       
  

