using System.Data.Entity;
using Microsoft.AspNet.Identity.EntityFramework;
using Owin;

namespace Ticket.Oauth
{

    internal class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public IDbSet<UserInfo> UsersInfo { get; set; }

        public ApplicationDbContext()
            : base("DefaultConnection", throwIfV1Schema: false)
        {
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