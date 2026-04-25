import { Component, EventEmitter, Output } from '@angular/core';
import { NotaFiscal } from '../../shared/models/nota-fiscal.models';
import { CommonModule } from '@angular/common';
import { NotaFiscalLayoutComponent } from "../../shared/componentes/nota-fiscal-layout/nota-fiscal-layout.component";
import { FaturamentoService } from '../../core/service/faturamento.service';
 
@Component({
  selector: 'app-faturamento',
  imports: [CommonModule, NotaFiscalLayoutComponent],
  templateUrl: './faturamento.component.html',
  styleUrl: './faturamento.component.scss'
})
export class FaturamentoComponent {
  @Output() mudarPagina = new EventEmitter<'estoque' | 'CNF'>();
  notaAlvo: NotaFiscal = new NotaFiscal();
  hiddenTabela: boolean = false;
  filtro: string = '';
  notasFiscais: NotaFiscal[] = [];

  constructor (private faturamentoService: FaturamentoService) {}

  ngOnInit() {
    this.faturamentoService.getFaturamento().subscribe({
      next: (notas) => {
        this.notasFiscais = notas;
      },
      error: (err) => {
        console.error(err);
        alert('Ocorreu um erro ao carregar o histórico de notas.');
      }
    });
  }

  visualizarNota(nota: NotaFiscal) {
    // Lógica para visualizar a nota fiscal selecionada
    this.notaAlvo = nota;
    this.hiddenTabela = true;
  }

  filtrarPor(tipo: string) {
    this.filtro = tipo;
  }
}
