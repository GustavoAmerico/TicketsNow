using System;
using System.ComponentModel.DataAnnotations;
using Ticket.Core;

namespace Ticket.Views.HttpApi.Models
{
    public class RequestModel : Core.IRequestModel
    {
        private RequestItemModel[] _itens;

        [Required]
        public int CardCvv { get; set; }

        [Required]
        public string CardNumber { get; set; }

        IRequestItemModel[] IRequestModel.Itens => Itens;

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
    }
}