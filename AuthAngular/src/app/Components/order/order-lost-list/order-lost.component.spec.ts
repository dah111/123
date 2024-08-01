import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderLostComponent } from './order-lost.component';

describe('AdminComponent', () => {
  let component: OrderLostComponent;
  let fixture: ComponentFixture<OrderLostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderLostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderLostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
