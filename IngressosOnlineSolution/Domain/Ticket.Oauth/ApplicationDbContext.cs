using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using Owin;
using Ticket.DB.EntityFramework;

namespace Ticket.Oauth
{
    [DbConfigurationType(typeof(ContextConfig))]
    internal class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public IDbSet<UserInfo> UsersInfo { get; set; }

        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ApplicationUser>()
                .HasRequired(x => x.Info)
                .WithRequiredPrincipal();

            base.OnModelCreating(modelBuilder);
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }

        public static void Create(Owin.IAppBuilder app)
        {
            app.CreatePerOwinContext(Create);

        }
    }
}