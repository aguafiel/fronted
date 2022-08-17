import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerAsignacionComponent } from './ver-asignacion.component';

describe('VerAsignacionComponent', () => {
  let component: VerAsignacionComponent;
  let fixture: ComponentFixture<VerAsignacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerAsignacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerAsignacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
