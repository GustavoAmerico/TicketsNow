using System;
using System.ComponentModel.DataAnnotations;
using Ticket.Core;

namespace Ticket.Views.HttpApi.Models
{
    public class RequestModel : IBuyOnCard
    {
        private RequestItemModel[] _itens;

        [Required]
        public int CardCvv { get; set; }

        [Required]
        public string CardNumber { get; set; }

        IRequestItemModel[] IBuyOnCard.Itens => Itens;

        public RequestItemModel[] Itens
        {
            get { return _itens ?? (_itens = new RequestItemModel[0]); }
            set { _itens = value; }
        }

        [Required]
        public string Name { get; set; }

        public bool SaveCard { get; set; }

        public Guid UserId { get; set; }

        [Required]
        public int ValidMonth { get; set; }

        [Required]
        public int ValidYear { get; set; }

        public int InstallmentCount { get; set; } = 1;

        [Required]
        public int CreditCardBrand { get; set; }

        public Guid? InstantBuyKey { get; set; }
    }
}