import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermissonComponent } from './permisson.component';

describe('PermissonComponent', () => {
  let component: PermissonComponent;
  let fixture: ComponentFixture<PermissonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PermissonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PermissonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
