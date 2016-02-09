using Owin;

namespace Ticket.Oauth
{
    public class OAuthStart
    {

        public static void Run(IAppBuilder app)
        {
            app.CreatePerOwinContext(ApplicationDbContext.Create);
            app.CreatePerOwinContext<ApplicationUserManager>(ApplicationUserManager.Create);

        }

    }
}