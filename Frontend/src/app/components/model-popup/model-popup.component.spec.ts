import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelPopupComponent } from './model-popup.component';

describe('ModelPopupComponent', () => {
  let component: ModelPopupComponent;
  let fixture: ComponentFixture<ModelPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModelPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModelPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
