import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderMedisComponent } from './order-medis.component';

describe('OrderMedisComponent', () => {
  let component: OrderMedisComponent;
  let fixture: ComponentFixture<OrderMedisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderMedisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderMedisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
