import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';
import { MaterialModule } from '../material/material.module';
import { RegisterComponent } from './register.component';

fdescribe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireDatabaseModule,
        MaterialModule,
        RouterModule
      ],    
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });

  // it('[Email-Check] should check if user enter correct email address', () => {
  //   let email = component .registerForm.controls['email'];
  //   email.setValue = ('ngoctuzoe@gmail.com');
  //   expect(email['errors']).toBeFalsy();
  // })

  // it('[Password - Check] should check if the password is valid', () => {
  //   let password = component.registerForm.controls['password'];
  //   password.setValue('123456')
  //   expect(password.errors).toBeNull();
  //   expect(password.valid).toBeTruthy();

  // })
});
