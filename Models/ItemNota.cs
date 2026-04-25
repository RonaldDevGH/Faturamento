using System.ComponentModel.DataAnnotations;

namespace FaturamentoAPI.Models
{
    public class ItemNota
    {
        [Key]
        public int Id { get; set; }
        public int ProdutoId { get; set; }
        public int notaSeq { get; set; }
        public int Quantidade { get; set; }
    }
}