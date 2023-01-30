import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetsGridComponent } from './widgets-grid.component';

describe('WidgetsGridComponent', () => {
  let component: WidgetsGridComponent;
  let fixture: ComponentFixture<WidgetsGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetsGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WidgetsGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
