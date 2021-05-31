import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSideNavComponent } from './client-side-nav.component';

describe('ClientSideNavComponent', () => {
  let component: ClientSideNavComponent;
  let fixture: ComponentFixture<ClientSideNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientSideNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
