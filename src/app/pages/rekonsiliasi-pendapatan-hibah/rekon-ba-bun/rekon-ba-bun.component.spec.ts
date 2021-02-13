import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RekonBaBunComponent } from './rekon-ba-bun.component';

describe('RekonBaBunComponent', () => {
  let component: RekonBaBunComponent;
  let fixture: ComponentFixture<RekonBaBunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RekonBaBunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RekonBaBunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
