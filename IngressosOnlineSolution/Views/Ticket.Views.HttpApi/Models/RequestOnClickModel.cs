using System;

namespace Ticket.Views.HttpApi.Models
{
    using System.ComponentModel.DataAnnotations;
    using Core;

    public class RequestOnClickModel : IBuyOnClick
    {
        [Required]
        public IRequestItemModel[] Itens { get; }

        public Guid UserId { get; set; }
    }
}