using System.Data.Entity;
using Ticket.DB.EntityFramework.Migrations;

namespace Ticket.DB.EntityFramework
{
    [DbConfigurationType(typeof(ContextConfig))]
    internal class Context : DbContext, IDataProvider
    {

        /// <summary>Gets and sets an provider to access events list</summary>
        public DbSet<Event> Events { get; set; }

        /// <summary>Gets and sets an provider to access request tickts from <see cref="Event"/></summary>
        public DbSet<Request> Requests { get; set; }

        /// <summary>Gets and sets an provider to access itens from <see cref="Request"/></summary>

        public DbSet<RequestItem> RequestItems { get; set; }

        /// <summary>Gets and sets an provider to access categories of <see cref="Event"/></summary>

        public DbSet<Category> Categories { get; set; }

        /// <summary>Gets and sets an provider to access user information</summary>

        public DbSet<UserInfo> UsersInfo { get; set; }

        /// <summary>Initialize the context from database with default settings</summary>
        public Context() : base("DefaultConnection")
        {
            Database.CreateIfNotExists();
            Database.SetInitializer(new MigrateDatabaseToLatestVersion<Context, Configuration>());

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            var currentAssembly = typeof(Context).Assembly;
            modelBuilder.Configurations.AddFromAssembly(currentAssembly);
        }


        /// <summary>Relead all data from database</summary>
        /// <typeparam name="T">type from object</typeparam>
        /// <param name="item">object to reload</param>

        /// <remarks>the <see cref="item"/>The item should be part of the context</remarks>
        public void Reload<T>(T item) where T : class
        {
            Entry(item).Reload();
        }
    }
}
