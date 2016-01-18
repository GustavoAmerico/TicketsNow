using System;
using Ticket.Core;

namespace Ticket.Views.HttpApi.Models
{
    public class RequestItemModel : IRequestItemModel
    {
        /// <summary>Gets and sends identification from event</summary>
        public Guid Id { get; set; }

        /// <summary>Gets and sends the price for anuncies</summary>
        public decimal Price { get; set; }

        /// <summary>Gets and sends count of tickets</summary>
        public int Qtd { get; set; }
    }
}