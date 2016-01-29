using System;
using System.Linq;

namespace Ticket.Core
{
    internal class RequestView
    {
        private Request _request;

        public RequestView(Request request)
        {
            _request = request;

        }

        public DateTime Date => _request.Date;


        public string Description
        {
            get
            {
                var resquest = _request.Itens.Select(i => $"{i.NumberOfItens} tickets for {i.Event.Title}");
                if (!_request.Any()) return "No itens for this request";
                return resquest.Aggregate((c, r) => $"{c} <br/> {r}");

            }
        }

        public string Number => _request.Id.ToString();


        public string Status { get; set; }



        public decimal Total => _request.Total;
    }
}