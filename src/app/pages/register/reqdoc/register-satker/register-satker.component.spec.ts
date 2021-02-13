import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterSatkerComponent } from './register-satker.component';

describe('RegisterSatkerComponent', () => {
  let component: RegisterSatkerComponent;
  let fixture: ComponentFixture<RegisterSatkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterSatkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterSatkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
