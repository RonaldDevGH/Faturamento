import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotaFiscalLayoutComponent } from './nota-fiscal-layout.component';

describe('NotaFiscalLayoutComponent', () => {
  let component: NotaFiscalLayoutComponent;
  let fixture: ComponentFixture<NotaFiscalLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotaFiscalLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotaFiscalLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
