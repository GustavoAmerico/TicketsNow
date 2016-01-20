using System.Collections.Generic;

namespace Ticket.Collections
{
    public class RequestItemCollection : BaseCollection<RequestItem>
    {
        public RequestItemCollection()
        {

        }

        public RequestItemCollection(ICollection<RequestItem> events) : base(events)
        {
        }


        public static implicit operator RequestItemCollection(RequestItem[] request)
        {
            return new RequestItemCollection(request);
        }

    }
}