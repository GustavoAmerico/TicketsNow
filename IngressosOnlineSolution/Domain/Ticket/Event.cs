using System;

namespace Ticket
{
    /// <summary>Event</summary>
    public class Event
    {
        /// <summary>Gets and sends the decription and details</summary>
        public string Decription { get; set; }

        /// <summary>Gets and sends the identification</summary>
        public Guid Id { get; set; }

        /// <summary>Gets and sends the image for represent the event</summary>
        public string Image { get; set; }

        /// <summary>Gets and sends the price</summary>
        public decimal Price { get; set; }

        /// <summary>Gets and sends the status</summary>
        public EventStatus Status { get; set; }

        public int CategoryId { get; set; }

        public virtual Category Category { get; set; }

        /// <summary>Gets and sends the title </summary>
        public string Title { get; set; }
    }
}
