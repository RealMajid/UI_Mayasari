import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PeraturanPlaceholderComponent } from './peraturan-placeholder.component';

describe('PeraturanPlaceholderComponent', () => {
  let component: PeraturanPlaceholderComponent;
  let fixture: ComponentFixture<PeraturanPlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PeraturanPlaceholderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PeraturanPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
