using System.Data.Entity;
using Ticket.DB.EntityFramework.Migrations;
using SqlProviderServices = System.Data.Entity.SqlServer.SqlProviderServices;
namespace Ticket.DB.EntityFramework
{
    [DbConfigurationType(typeof(ContextConfig))]
    internal class Context : DbContext
    {
        public DbSet<Event> Events { get; set; }

        public DbSet<Request> Requests { get; set; }

        public DbSet<RequestItem> RequestItems { get; set; }

        public DbSet<Category> Categories { get; set; }

        public Context() : base("DefaultConnection")
        {

            Database.CreateIfNotExists();
            //     Database.SetInitializer(new MigrateDatabaseToLatestVersion<Context, Configuration>());


        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            var currentAssembly = typeof(Context).Assembly;
            modelBuilder.Configurations.AddFromAssembly(currentAssembly);
        }
    }
}
