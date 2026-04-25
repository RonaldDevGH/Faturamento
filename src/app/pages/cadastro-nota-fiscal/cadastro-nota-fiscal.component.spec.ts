import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastroNotaFiscalComponent } from './cadastro-nota-fiscal.component';

describe('CadastroNotaFiscalComponent', () => {
  let component: CadastroNotaFiscalComponent;
  let fixture: ComponentFixture<CadastroNotaFiscalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastroNotaFiscalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CadastroNotaFiscalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
