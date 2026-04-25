import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstoqueComponent } from './pages/estoque/estoque.component';
import { FaturamentoComponent } from "./pages/faturamento/faturamento.component";
import { CadastroNotaFiscalComponent } from "./pages/cadastro-nota-fiscal/cadastro-nota-fiscal.component";  

@Component({
  selector: 'app-root',
  imports: [CommonModule, EstoqueComponent, FaturamentoComponent, CadastroNotaFiscalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Korp_Teste_RonaldSilva';
  paginaAtual: 'estoque' | 'faturamento' | 'CNF' = 'estoque';
}
