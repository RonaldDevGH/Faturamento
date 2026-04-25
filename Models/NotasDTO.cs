using System.ComponentModel.DataAnnotations;
namespace FaturamentoAPI.Models;

public class NotasDTO
{
    public int SeqNumero { get; set; }
    public string Status { get; set; } = "";
    public DateTime DataEmissao { get; set; }
    public required List<ItemNotaDTO> Produtos { get; set; }
}

public class ItemNotaDTO
{
    public int ProdutoId { get; set; }
    public int Quantidade { get; set; }
}