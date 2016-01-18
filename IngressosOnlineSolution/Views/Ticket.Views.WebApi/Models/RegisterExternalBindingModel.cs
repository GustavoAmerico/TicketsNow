using System.ComponentModel.DataAnnotations;

namespace Ticket.Views.WebApi.Models
{
    public class RegisterExternalBindingModel
    {
        [Required]
        [Display(Name = "Email")]
        public string Email { get; set; }
    }
}