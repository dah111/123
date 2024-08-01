import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderStoreComponent } from './order-store.component';

describe('OrderStoreComponent', () => {
  let component: OrderStoreComponent;
  let fixture: ComponentFixture<OrderStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrderStoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
