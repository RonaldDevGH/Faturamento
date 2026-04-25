import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Produto } from '../../shared/models/produto.models';
import { EstoqueService } from '../../core/service/estoque.service';

@Component({
  selector: 'app-estoque',
  imports: [FormsModule, CommonModule],
  templateUrl: './estoque.component.html',
  styleUrl: './estoque.component.scss'
})
export class EstoqueComponent implements OnInit {
  @Output() mudarPagina = new EventEmitter<'faturamento' | 'CNF'>();

  produtos: Produto[] = [];
  produto: Produto = new Produto();
  exibirForm: boolean = false;

  constructor(private estoqueService: EstoqueService) { }

  ngOnInit(): void {
    this.estoqueService.getEstoque().subscribe((data: Produto[]) => {
      this.produtos = data;
      console.log('Produtos carregados:', this.produtos.length);
    });
  }

  validarProduto(): void {
    let isValid = true;

    // Validação da descrição
    if (this.produto.descricao.trim() === '') {
      alert('A descrição do produto não pode estar vazia.');
      isValid = false;
    }

    if (this.produto.descricao.length > 255) {
      alert('A descrição do produto deve ter no máximo 255 caracteres.');
      isValid = false;
    }

    if (this.produtos.some(p => p.descricao.toLowerCase() === this.produto.descricao.toLowerCase())) {
      alert('Já existe um produto cadastrado com esta descrição.');
      isValid = false;
    }

    if (this.produto.saldo <= 0) {
      alert('A quantidade do produto deve ser maior que zero.');
      isValid = false;
    }

    if (isValid) {
      this.estoqueService.postEstoque(this.produto).subscribe({
        next: (produtoVindoDoBanco) => {
          this.produtos.push(produtoVindoDoBanco); 
          this.produto = new Produto();
          this.exibirForm = false;
        },
        error: (err) => {
          console.error('Erro ao salvar:', err);
          alert('Erro ao cadastrar produto. O banco de dados recusou a operação.');
        }
      });
    }
  }
}
