using System.CodeDom;
using System.Collections.Generic;
using System.Linq;

namespace Ticket.Collections
{
    public class EventCollection : BaseCollection<Event>
    {
        public EventCollection()
        {

        }

        public EventCollection(ICollection<Event> events) : base(events)
        {
        }

        public EventCollection Where(EventStatus status)
        {
            return this.Where(x => x.Status == status)
                .ToArray();

        }

        public static implicit operator EventCollection(Event[] events)
        {
            return new EventCollection(events);
        }

    }
}