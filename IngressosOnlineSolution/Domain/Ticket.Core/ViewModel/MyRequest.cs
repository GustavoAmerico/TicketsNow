namespace Ticket.Core.ViewModel
{
    using System;
    public class MyRequest
    {
        public MyRequest(string id, DateTime date, string description, string status, decimal total)
        {
            Id = id;
            Date = date;
            Description = description;
            Status = status;
            Total = total;
        }

        /// <summary>Gets the date that the request was created</summary>
        public DateTime Date { get; internal set; }

        /// <summary>Gets the description about requst</summary>
        public string Description { get; internal set; }

        /// <summary>Gets the number of request</summary>
        public string Id { get; internal set; }

        /// <summary>Gets the status paymant</summary>
        public string Status { get; internal set; }

        /// <summary>Gets the price total </summary>
        public decimal Total { get; internal set; }
    }
}