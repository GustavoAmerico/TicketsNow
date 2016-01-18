using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;

namespace Ticket.DB.EntityFramework.TicketConfig
{
    internal class EventMap : EntityTypeConfiguration<Event>
    {

        public EventMap()
        {
            ToTable("Events");

            HasKey(x => x.Id)
                ;
            Property(x => x.Id)
                .HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);

            HasRequired(x => x.Category)
                .WithMany()
                .HasForeignKey(x => x.CategoryId);
        }
    }
}