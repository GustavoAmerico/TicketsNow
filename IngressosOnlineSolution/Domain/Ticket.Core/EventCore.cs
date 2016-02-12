using System.Linq;
using Ticket.DB.EntityFramework;

namespace Ticket.Core
{
    public class EventCore
    {
        private readonly DB.IEventContext _repository;

        public EventCore()
        {
            _repository = new Repository();
        }

        public EventCore(DB.IEventContext repository)
        {
            _repository = repository;

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
    }
}