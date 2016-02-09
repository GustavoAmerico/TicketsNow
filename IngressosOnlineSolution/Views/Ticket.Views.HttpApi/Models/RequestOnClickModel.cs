using System;

namespace Ticket.Views.HttpApi.Models
{
    using System.ComponentModel.DataAnnotations;
    using Core;

    public class RequestOnClickModel : IBuyOnClick
    {
        RequestItemModel[] _itens;

        public Guid? InstantBuyKey { get; set; }

        IRequestItemModel[] IBuyOnClick.Itens => Itens;

        [Required]
        public RequestItemModel[] Itens
        {
            get { return _itens ?? (_itens = new RequestItemModel[0]); }
            set { _itens = value; }
        }

        public Guid UserId { get; set; }
    }
}