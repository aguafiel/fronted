import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonaPrevendedorComponent } from './zona-prevendedor.component';

describe('ZonaPrevendedorComponent', () => {
  let component: ZonaPrevendedorComponent;
  let fixture: ComponentFixture<ZonaPrevendedorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZonaPrevendedorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZonaPrevendedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
