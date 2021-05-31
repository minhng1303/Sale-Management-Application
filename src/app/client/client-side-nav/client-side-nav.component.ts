import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Client } from 'src/app/models/client';
import { ClientService } from 'src/app/services/ClientService/client.service';

@Component({
  selector: 'app-client-side-nav',
  templateUrl: './client-side-nav.component.html',
  styleUrls: ['./client-side-nav.component.css'],
})
export class ClientSideNavComponent implements OnInit, OnChanges {
  @Input('clients') clients: Client[];
  @Input('sortedClients') sortedClients: Client[];
  @Input('editMode') editMode: boolean;
  @Input('selectedClient') selectedClient: Client;
  @Output('onClientChange') onClientChange: EventEmitter<Client[]> =
    new EventEmitter();
  @Output('onEditChange') onEditChange: EventEmitter<boolean> =
    new EventEmitter();
  subscribeForm;
  errorMessage: string = ' ';
  clientName: string = '';
  clientPhone: string = '';
  phoneList: Client[];
  nameList: Client[];
  vietnamese: string =
    '^[a-zA-Z ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹsW|_]+$';
  constructor(private clientService: ClientService, private fb: FormBuilder) {
    this.subscribeForm = fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.minLength(6),
          Validators.pattern(this.vietnamese),
        ],
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.maxLength(12),
          Validators.pattern('[0-9]*'),
        ],
      ],
    });
  }

  ngOnInit(): void {}

  searchClient() {
    if (this.clientPhone != '') {
      this.clients = this.phoneList.filter((client) => {
        return client['name']
          .toLowerCase()
          .replace(/\s/g, '')
          .includes(this.clientName.toLowerCase().replace(/\s/g, ''));
      });
      this.onClientChange.emit(this.clients);
      return;
    }
    this.nameList = this.clients = this.sortedClients.filter((client) => {
      return client['name']
        .toLowerCase()
        .replace(/\s/g, '')
        .includes(this.clientName.toLowerCase().replace(/\s/g, ''));
    });
    this.onClientChange.emit(this.clients);
  }

  searchClientPhone() {
    if (this.clientName != '') {
      this.clients = this.nameList.filter((client) => {
        return client['phone']
          .toString()
          .toLowerCase()
          .replace(/\s/g, '')
          .includes(this.clientPhone.toLowerCase().replace(/\s/g, ''));
      });
      this.onClientChange.emit(this.clients);
      return;
    }
    this.phoneList = this.clients = this.sortedClients.filter((client) => {
      return client['phone']
        .toString()
        .toLowerCase()
        .replace(/\s/g, '')
        .includes(this.clientPhone.toLowerCase().replace(/\s/g, ''));
    });
    this.onClientChange.emit(this.clients);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editMode']) {
      if (changes['editMode'].currentValue == true) {
        this.subscribeForm.setValue({
          name: this.selectedClient.name,
          phone: this.selectedClient.phone,
        });
      }
    }
  }

  cancel() {
    this.editMode = false;
    this.subscribeForm.reset();
    this.onEditChange.emit(this.editMode);
  }

  get(name) {
    return this.subscribeForm['controls'][name];
  }

  onSubmit(name, phone, e) {
    this.clearErrorMessage();
    let isExist: boolean = false;
    this.clients.forEach((item) => {
      if (item.phone == phone) {
        isExist = true;
      }
    });
    if (!isExist) {
      this.clientService.addClient(
        this.subscribeForm.value['name'],
        this.subscribeForm.value['phone'],
        this.getClientId
      );
      this.subscribeForm.reset();
      return;
    }
    this.errorMessage = 'Số điện thoại đã tồn tại';
  }

  get getClientId() {
    return String(
      Number(this.sortedClients[this.sortedClients.length - 1].id) + 1
    );
  }

  clearErrorMessage() {
    this.errorMessage = ' ';
  }

  async updateClient(client) {
    this.editMode = false;
    await this.clientService.updateClient(
      client,
      this.subscribeForm.value['name'],
      this.subscribeForm.value['phone']
    );
    this.subscribeForm.reset();
    this.onEditChange.emit(this.editMode);
  }

  log() {
    console.log(this.subscribeForm);
  }
}
