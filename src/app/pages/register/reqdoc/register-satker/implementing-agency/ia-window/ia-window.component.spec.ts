import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IaWindowComponent } from './ia-window.component';

describe('IaWindowComponent', () => {
  let component: IaWindowComponent;
  let fixture: ComponentFixture<IaWindowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IaWindowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IaWindowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
