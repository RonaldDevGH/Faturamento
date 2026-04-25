using Microsoft.EntityFrameworkCore;
using FaturamentoAPI.Models;

namespace FaturamentoAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<NotaFiscal> notas_fiscais { get; set; }
        public DbSet<ItemNota> item_nota { get; set; }
    }
}