import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoEmpleadoComponent } from './tipo-empleado.component';

describe('TipoEmpleadoComponent', () => {
  let component: TipoEmpleadoComponent;
  let fixture: ComponentFixture<TipoEmpleadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipoEmpleadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoEmpleadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
