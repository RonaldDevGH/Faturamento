using System.ComponentModel.DataAnnotations;

namespace FaturamentoAPI.Models
{
    public class NotaFiscal
    {
        [Key]
        public int SeqNumero { get; set; }
        public string Status { get; set; } = string.Empty;
        public DateTime DataEmissao { get; set; }
    }
}