using System.Data.Entity.ModelConfiguration;

namespace Ticket.DB.EntityFramework.TicketConfig
{
    internal class CategoryMap : EntityTypeConfiguration<Category>
    {
        public CategoryMap()
        {
            ToTable("Categories");
            HasKey(x => x.Id);
        }

    }
}