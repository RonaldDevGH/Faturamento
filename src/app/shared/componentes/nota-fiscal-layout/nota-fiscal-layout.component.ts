import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { NotaFiscal } from '../../models/nota-fiscal.models';
import { EstoqueService } from '../../../core/service/estoque.service';
import { Produto } from '../../models/produto.models';

@Component({
  selector: 'app-nota-fiscal-layout',
  imports: [ CommonModule ],
  templateUrl: './nota-fiscal-layout.component.html',
  styleUrl: './nota-fiscal-layout.component.scss'
})
export class NotaFiscalLayoutComponent {
  @Input() notaFiscal: NotaFiscal = new NotaFiscal();
  produtosInfo: { [key: number]: Produto } = {};
  processando: boolean = false;

  constructor (private estoqueService: EstoqueService) {}

  ngOnInit() {
    if (!this.notaFiscal?.produtos?.length) return;

    this.processando = true;

    const pedidos = this.notaFiscal.produtos.map(item => 
      this.estoqueService.getProdutoById(item.produtoId)
    );

    forkJoin(pedidos).subscribe({
      next: (produtosVindosDoBanco) => {
        produtosVindosDoBanco.forEach(p => {
          this.produtosInfo[p.id] = p;
        });
        this.processando = false;
      },
      error: (err) => {
        console.error('Falha ao carregar estoque:', err);
        this.processando = false;
        alert('Erro ao carregar detalhes dos produtos.');
      }
    });
  }
}
