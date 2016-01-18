using System;

namespace Ticket
{
    public class RequestItem
    {
        public virtual Event Event { get; set; }

        /// <summary>Gets and sends the identificationof <see cref="Event"/></summary>
        public Guid EventId { get; set; }

        /// <summary>Gets and sends the price of event at date of buy</summary>
        public decimal PriceForRequest { get; set; }

        public virtual Request Request { get; set; }

        /// <summary>Gets and sends the identification of <see cref="Request"/></summary>
        public Guid RequestId { get; set; }

     
    }
}