import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Produto } from '../../shared/models/produto.models';
import { ItemNota } from '../../shared/models/item-nota.models';
import { NotaFiscal } from '../../shared/models/nota-fiscal.models';
import { NotaFiscalLayoutComponent } from "../../shared/componentes/nota-fiscal-layout/nota-fiscal-layout.component";
import { EstoqueService } from '../../core/service/estoque.service';
import { FaturamentoService } from '../../core/service/faturamento.service';

@Component({
  selector: 'app-cadastro-nota-fiscal',
  imports: [FormsModule, CommonModule, NotaFiscalLayoutComponent],
  templateUrl: './cadastro-nota-fiscal.component.html',
  styleUrl: './cadastro-nota-fiscal.component.scss'
})
export class CadastroNotaFiscalComponent {
  @Output() mudarPagina = new EventEmitter<'estoque' | 'faturamento'>();

  produtoSelecionado: Produto = new Produto();
  novaNota: NotaFiscal = new NotaFiscal();
  quantidadeSelecionada: number = 0;
  view: 'tabela-produtos' | 'nota-fiscal' = 'tabela-produtos';
  mostrarForm: boolean = false;
  processando: boolean = false;
  imprimirDisabled: boolean = false;

  produtos: Produto[] = [];
  produtosNaNota: ItemNota[] = [];

  constructor(private estoqueService: EstoqueService, private faturamentoService: FaturamentoService) {
  }

  ngOnInit(): void {
      this.estoqueService.getEstoque().subscribe((data: Produto[]) => {
      this.produtos = data;
    });
  }

  getDescricaoProduto(id: number): string {
    const produto = this.produtos.find(prod => prod.id === id);
    
    return produto ? produto.descricao : '';
  }

  adicionarProduto(produto: Produto, quantidade: number) {
    if (quantidade <= 0) {
      alert('Quantidade inválida.');
    } 
    else if (quantidade > produto.saldo) {
      alert(`Quantidade selecionada excede o saldo disponível (${produto.saldo}).`);
    } 
    else if (this.produtosNaNota.find(item => item.produtoId === produto.id)) {
      const itemExistente = this.produtosNaNota.find(item => item.produtoId === produto.id)!;
      const novaQuantidade = itemExistente.quantidade + quantidade;
      if (novaQuantidade > produto.saldo) {
        alert(`A soma das quantidades (${novaQuantidade}) excede o saldo disponível (${produto.saldo}).`);
      } else {
        itemExistente.quantidade = novaQuantidade;
      }
    }
    else {
      const item = new ItemNota();
      item.produtoId = produto.id;
      item.quantidade = quantidade;
      this.produtosNaNota.push(item);
    } 
    this.mostrarForm = false;
  } 

  removerProduto(index: number) {
    this.produtosNaNota.splice(index, 1);
  }

  gerarNotaFiscal() {
    if (this.produtosNaNota.length > 0) {
      this.novaNota.seqNumero = Math.floor(Math.random() * 999999999);
      this.novaNota.status = 'Aberta';
      this.novaNota.dataEmissao = 'Em andamento'; 
      this.novaNota.produtos = this.produtosNaNota;
      alert(`Nota fiscal gerada com ${this.novaNota.produtos.length} produtos!`);
      this.view = 'nota-fiscal';
    }
  }

  gerarNovaNota() {
    this.novaNota = new NotaFiscal();
    this.produtosNaNota = [];
    this.view = 'tabela-produtos';
    this.imprimirDisabled = false;
  }

  imprimirNotaFiscal() {
    if (this.novaNota.produtos.length === 0) {
      alert('Não há produtos na nota fiscal para imprimir.');
      return;
    }
    this.processando = true;
    this.imprimirDisabled = true;
    this.novaNota.status = 'Fechada';
    this.novaNota.dataEmissao = new Date().toISOString();

    this.produtosNaNota.forEach(item => {
      const produto = this.produtos.find(p => p.id === item.produtoId);
      if (produto) {
        produto.saldo -= item.quantidade;
      }
    });

    this.novaNota.produtos = [...this.produtosNaNota];
    this.faturamentoService.postFaturamento(this.novaNota).subscribe({
      next: (notaSalva) => {
        this.estoqueService.putEstoque(this.produtos).subscribe({
          next: () => {
            this.processando = false;
            alert('Nota emitida e estoque atualizado!');
          },
          error: () => alert('Nota salva, mas houve erro ao atualizar estoque.')
        });
      },
      error: (err) => {
        alert('Erro ao emitir nota: ' + err.message);
        this.processando = false;
        this.imprimirDisabled = false; // Devolve o botão para ele tentar de novo
      }
    });
  }
}

//Resumo: 
// Este componente recebe os produtos cadastrados e seus respectivos saldos, permitindo o usuário selecionar
// um ou multiplos produtos e suas quantidades para cadastrar uma nota fiscal. A quantidade selecionada de cada
// produto não deve ser maior que o saldo disponível