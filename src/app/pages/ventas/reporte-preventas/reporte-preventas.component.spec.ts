import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePreventasComponent } from './reporte-preventas.component';

describe('ReportePreventasComponent', () => {
  let component: ReportePreventasComponent;
  let fixture: ComponentFixture<ReportePreventasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportePreventasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePreventasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
