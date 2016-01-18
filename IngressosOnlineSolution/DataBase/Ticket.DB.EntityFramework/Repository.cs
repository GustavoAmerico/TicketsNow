using Ticket.Collections;
using System.Linq;
namespace Ticket.DB.EntityFramework
{
    public class Repository
    {
        private readonly Context _context;

        private EfTable<Event, EventCollection> _events;
        private EfTable<Request, RequestCollection> _requests;

        public EfTable<Event, EventCollection> Events
            => _events ?? (_events = new EfTable<Event, EventCollection>(_context.Events, (x) => new EventCollection(x)));


        public EfTable<Request, RequestCollection> Requests
            => _requests ?? (_requests = new EfTable<Request, RequestCollection>(_context.Requests, (x) => new RequestCollection(x)));




        public Repository()
        {
            _context = new Context();



        }


        public int SaveChange()
        {
            return _context.SaveChanges();
        }
    }
}