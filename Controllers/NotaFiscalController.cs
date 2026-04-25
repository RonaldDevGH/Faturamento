using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FaturamentoAPI.Data;
using FaturamentoAPI.Models;

namespace FaturamentoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotaFiscalController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NotaFiscalController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/notas-fiscais (Lista todos)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<NotasDTO>>> GetNotasFiscais()
        {
            var notas = await _context.notas_fiscais.ToListAsync();
            if (notas == null || !notas.Any())
            {
                return Ok(new List<NotasDTO>());
            }
            var seqNums = notas.Select(n => n.SeqNumero).ToList();
            var itensRelacionados = await _context.item_nota
                .Where(i => seqNums.Contains(i.notaSeq))
                .ToListAsync();

            // Converte a entidade do banco de volta para o DTO que o Front conhece
            var listaDto = notas.Select(n => new NotasDTO {
                SeqNumero = n.SeqNumero,
                Status = n.Status,
                DataEmissao = n.DataEmissao,
                Produtos = itensRelacionados
                    .Where(i => i.notaSeq == n.SeqNumero)
                    .Select(i => new ItemNotaDTO {
                        ProdutoId = i.ProdutoId,
                        Quantidade = i.Quantidade
                    }).ToList()
            });

            return Ok(listaDto);
        }

        // POST: api/notas-fiscais (Cadastra um novo)
        [HttpPost]
        public async Task<ActionResult<NotasDTO>> PostNotaFiscal(NotasDTO notaFiscalDto)
        {
            // 1. Criar a entidade da Nota (Cabeçalho)
            var novaNota = new NotaFiscal 
            {
                SeqNumero = notaFiscalDto.SeqNumero,
                Status = notaFiscalDto.Status,
                DataEmissao = notaFiscalDto.DataEmissao,
            };

            using var transaction = await _context.Database.BeginTransactionAsync();

            try 
            {
                _context.notas_fiscais.Add(novaNota);
                await _context.SaveChangesAsync(); 

                var itensNota = notaFiscalDto.Produtos.Select(item => new ItemNota 
                {
                    ProdutoId = item.ProdutoId,
                    Quantidade = item.Quantidade,
                    notaSeq = novaNota.SeqNumero 
                }).ToList();

                _context.item_nota.AddRange(itensNota);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();

                return CreatedAtAction(nameof(GetNotasFiscais), new { id = novaNota.SeqNumero }, notaFiscalDto);
            } 

            catch (Exception ex)
            {
                await transaction.RollbackAsync();

                var mensagemErro = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return BadRequest(new { message = "Erro de integridade: " + mensagemErro });
            }
        }
    }
}