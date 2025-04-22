import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FurnitureButtonComponent } from './furniture-button.component';

describe('FurnitureButtonComponent', () => {
  let component: FurnitureButtonComponent;
  let fixture: ComponentFixture<FurnitureButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FurnitureButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FurnitureButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
