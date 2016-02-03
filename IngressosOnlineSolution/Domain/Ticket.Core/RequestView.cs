using System;
using System.Linq;

namespace Ticket.Core
{
    public class RequestView
    {
        private Request _request;

        public RequestView(Request request)
        {
            _request = request;

            var requestView = _request.Itens
                .Select(i => $"{i.NumberOfItens} tickets for {i.Event.Title}")
                .ToArray();

            Description = requestView.Any()
                ? requestView.Aggregate((c, r) => $"{c} <br/> {r}")
                : "No itens for this request";
        }

        public DateTime Date => _request.Date;


        public string Description { get; }

        public string Number => _request.Id.ToString();


        public decimal Total => _request.Total;
    }
}