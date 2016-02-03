using System;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Ticket.Oauth
{
    // You can add profile data for the user by adding more properties to your ApplicationUser class, please visit http://go.microsoft.com/fwlink/?LinkID=317594 to learn more.
    public class ApplicationUser : IdentityUser
    {
        public virtual UserInfo Info { get; set; }

        public ApplicationUser()
        {

        }

        public override string Id { get; set; } = Guid.NewGuid().ToString();

        public ApplicationUser(ApplicationUserModel model)
        {
            if (model == null)
                throw new NullReferenceException($"The {nameof(model)} is null");

            if (Info == null)
                Info = new UserInfo();
            Info.Id = Id;
            Info.Address.Add(model.Address);
            Info.Name = model.Name;
            Info.Cpf = model.Cpf;
            Info.BirthDate = model.BirthDate;
            Info.Gender = model.Gender;
            Info.Email = UserName = Email = model.Email;

        }

        public async Task<ClaimsIdentity> GenerateUserIdentityAsync(UserManager<ApplicationUser> manager, string authenticationType)
        {



            // Note the authenticationType must match the one defined in CookieAuthenticationOptions.AuthenticationType
            var userIdentity = await manager.CreateIdentityAsync(this, authenticationType);
            // Add custom user claims here
            return userIdentity;
        }

    }
}