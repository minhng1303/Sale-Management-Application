import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { SettingComponent } from './setting/setting.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TodoDetailComponent } from './todo-detail/todo-detail.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { StaffComponent } from './staff/staff.component';
import { MenuComponent } from './menu/menu.component';
import { ExpenseComponent } from './expense/expense.component';
import { StorageComponent } from './storage/storage.component';
import { VoucherComponent } from './voucher/voucher.component';
import { ClientComponent } from './client/client.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account/account.component';
import { RegistrationComponent } from './registration/registration.component';
import { RevenueComponent } from './revenue/revenue.component';
import { PermissonComponent } from './permisson/permisson.component';
import { AdminGuard } from './admin-guard';
import { AuthGuard } from './auth-guard';
import { AboutUsComponent } from './about-us/about-us.component';


const routes: Routes = [
    {
        path: '',
        redirectTo: 'orders',
        pathMatch: 'full',
      },
      {
        path: 'orders',
        component: HomeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'register',
        component: RegisterComponent
      },
      {
        path: 'staff',
        component: StaffComponent,
        canActivate:  [AuthGuard,AdminGuard],
      },
      {
        path: 'voucher',
        component: VoucherComponent,
        canActivate:  [AuthGuard,AdminGuard],
      },
      {
        path: 'storage',
        component: StorageComponent,
        canActivate:  [AuthGuard,AdminGuard],
      },
      {
        path: 'about',
        component: AboutUsComponent,
      },
      {
        path: 'menu',
        component: MenuComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'client',
        component: ClientComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'expense',
        component: ExpenseComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'permisson',
        component: PermissonComponent,
        canActivate: [AuthGuard,AdminGuard],
      },
      {
        path: 'history',
        component: TodosComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'history/:id', // Hai chấm để đánh dấu id là 1 param
        component: TodoDetailComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'revenue',
        component: RevenueComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'profile',
        component: SettingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'account',
        component: AccountComponent,
        canActivate:  [AuthGuard,AdminGuard],
      },
      {
        path: 'registration',
        component: RegistrationComponent,
        canActivate:  [AuthGuard,AdminGuard]
      },
      {
        path: 'login', 
        component: LoginComponent,
      },
      {
        path: '**',
        component: NotFoundComponent,
      },
    ];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
