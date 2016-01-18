using System.Data.Entity.ModelConfiguration;

namespace Ticket.DB.EntityFramework.TicketConfig
{
    internal class RequestItemMap : EntityTypeConfiguration<RequestItem>
    {
        public RequestItemMap()
        {
            ToTable("RequestItens");
            HasKey(x => new { x.RequestId, x.EventId });
            HasRequired(x => x.Event)
                .WithMany()
                .HasForeignKey(x => x.EventId);
        }
    }
}