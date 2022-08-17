import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultitablasComponent } from './multitablas.component';

describe('MultitablasComponent', () => {
  let component: MultitablasComponent;
  let fixture: ComponentFixture<MultitablasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultitablasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultitablasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
