using System.Data.Entity.ModelConfiguration;

namespace Ticket.DB.EntityFramework.TicketConfig
{
    class RequestMap : EntityTypeConfiguration<Request>
    {

        public RequestMap()
        {
            ToTable("Requests");

            HasKey(x => x.Id);

            HasMany(x => x.Itens)
                .WithRequired(y => y.Request)
                .HasForeignKey(x => x.RequestId);

            HasRequired(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId);

        }

    }
}
