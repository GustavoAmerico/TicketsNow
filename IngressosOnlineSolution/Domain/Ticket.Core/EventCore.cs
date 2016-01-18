using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Ticket.DB.EntityFramework;

namespace Ticket.Core
{
    public class EventCore
    {
        Repository _repository;

        public EventCore()
        {
            _repository = new Repository();


        }



        /// <summary>Returns all events open</summary>
        /// <returns>Returns all events open</returns>
        public Event[] AllOpen()
        {
            var events = _repository.Events
                .Base.Where(EventStatus.Open)
                .ToArray();
            return events;
        }


        public void Buy(IRequestModel model)
        {
            if (model == null || model.Itens.IsNullOrEmpty())
                return;

            var itens = model.Itens
                  .Select(x => new RequestItem()
                  {
                      EventId = x.Id,
                      PriceForRequest = x.Price
                  }).ToArray();

            var request = new Request(itens) { UserId = model.UserId.ToString() };

            var repository = new Repository();
            repository.Requests.Base.Add(request);
            repository.SaveChange();
        }

    }
}
