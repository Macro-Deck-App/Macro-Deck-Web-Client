import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetActionbuttonComponent } from './widget-actionbutton.component';

describe('WidgetActionbuttonComponent', () => {
  let component: WidgetActionbuttonComponent;
  let fixture: ComponentFixture<WidgetActionbuttonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetActionbuttonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetActionbuttonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
