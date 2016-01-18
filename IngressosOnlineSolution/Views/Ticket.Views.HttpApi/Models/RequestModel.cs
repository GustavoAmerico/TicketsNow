using System;
using System.ComponentModel.DataAnnotations;
using Ticket.Core;

namespace Ticket.Views.HttpApi.Models
{
    public class RequestModel : Core.IRequestModel
    {
        private RequestItemModel[] _itens;

        public int CardCvv { get; set; }

        public string CardNumber { get; set; }

        public RequestItemModel[] Itens
        {
            get { return _itens ?? (_itens = new RequestItemModel[0]); }
            set { _itens = value; }
        }

        public string Name { get; set; }

        public bool SaveCard { get; set; }

        [Required]
        public Guid UserId { get; set; }
        public int ValidMonth { get; set; }
        public int ValidYear { get; set; }

        IRequestItemModel[] IRequestModel.Itens => Itens;
    }
}
