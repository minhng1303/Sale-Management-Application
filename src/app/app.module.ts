import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LazyLoadImageModule } from 'ng-lazyload-image';
//-------------------------------------Component--------------------------------------------------------------
import { AppComponent } from './app.component';
import { SummaryPipe } from './summary.pipe';
import { ButtonComponent } from './component/button/button.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TodosComponent } from './todos/todos.component';
import { SettingComponent } from './setting/setting.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { StaffComponent } from './staff/staff.component';
import { MenuComponent } from './menu/menu.component';
import { ExpenseComponent } from './expense/expense.component';
import { StorageComponent } from './storage/storage.component';
import { VoucherComponent } from './voucher/voucher.component';
import { ClientComponent } from './client/client.component';
import { BarChartComponent } from './chart/bar-chart/bar-chart.component';
import { PieChartComponent } from './chart/pie-chart/pie-chart.component';
import { RegisterComponent } from './register/register.component';
// ------------------------------------Services----------------------------------------------------------
import { FirebaseService } from './services/firebase.service';
import { FirestoreService } from './services/firestore.service';
import TodoService from './services/todo.services';
import { StorageService } from './services/StorageService/storage.service';

//-------------------------------------Directive--------------------------------------------------------------
import { InputFormatDirective } from './input-format.directive';
import { HandleEmptyPipe } from './handle-empty.pipe';
import { RegistrationComponent } from './registration/registration.component';
import { RegisterDialogComponent } from './register-dialog/register-dialog.component';
import { RevenueComponent } from './revenue/revenue.component';
import { AccountComponent } from './account/account.component';
import { DayChartComponent } from './chart/day-chart/day-chart.component';
import { PermissonComponent } from './permisson/permisson.component';
import { DrinkDetailComponent } from './menu/drink-detail/drink-detail.component';
import { ClientSideNavComponent } from './client/client-side-nav/client-side-nav.component';
import { PaginationComponent } from './pagination/pagination.component';
import { DrinkFormComponent } from './menu/drink-form/drink-form.component';
import { IngredientFormComponent } from './storage/ingredient-form/ingredient-form.component';
import { PaymentFormComponent } from './home/payment-form/payment-form.component';
import { ExpenseFormComponent } from './expense/expense-form/expense-form.component';
import { FooterComponent } from './footer/footer.component';
import { AboutUsComponent } from './about-us/about-us.component';

@NgModule({
  declarations: [
    InputFormatDirective,
    SummaryPipe,
    HandleEmptyPipe,
    AppComponent,
    ButtonComponent,
    NavbarComponent,
    TodosComponent,
    SettingComponent,
    HomeComponent,
    LoginComponent,
    MenuComponent,
    ExpenseComponent,
    StorageComponent,
    VoucherComponent,
    ClientComponent,
    BarChartComponent,
    PieChartComponent,
    RegisterComponent,
    RegistrationComponent,
    TodoDetailComponent,
    RegisterDialogComponent,
    RevenueComponent,
    StaffComponent,
    AccountComponent,
    DayChartComponent,
    PermissonComponent,
    DrinkDetailComponent,
    ClientSideNavComponent,
    PaginationComponent,
    DrinkFormComponent,
    IngredientFormComponent,
    PaymentFormComponent,
    ExpenseFormComponent,
    FooterComponent,
    AboutUsComponent,
  ],
  entryComponents: [RegisterDialogComponent],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    BrowserModule,
    ChartsModule,
    MaterialModule,
    FormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    LazyLoadImageModule,
  ],
  providers: [TodoService, FirebaseService, FirestoreService, StorageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
