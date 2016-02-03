using System;
using System.Data.Entity.Infrastructure;
using Ticket.Collections;
using System.Linq;
namespace Ticket.DB.EntityFramework
{
    public class Repository : IRequestContext
    {
        private readonly Context _context;
        public IDataProvider Provider => _context;

        private EfTable<Event, EventCollection> _events;
        private EfTable<Request, RequestCollection> _requests;
        private EfTable<UserInfo, UserInfoCollection> _eventsInfo;

        public EfTable<Event, EventCollection> Events
            => _events ?? (_events = new EfTable<Event, EventCollection>(_context.Events, (x) => new EventCollection(x)));


        UserInfoCollection IRequestContext.UsersInfo => UsersInfo.Base;

        public EfTable<Request, RequestCollection> Requests
            => _requests ?? (_requests = new EfTable<Request, RequestCollection>(_context.Requests, (x) => new RequestCollection(x)));

        public EfTable<UserInfo, UserInfoCollection> UsersInfo => _eventsInfo ??
            (_eventsInfo = new EfTable<UserInfo, UserInfoCollection>(_context.UsersInfo, (x) => new UserInfoCollection(x)));

        RequestCollection IRequestContext.Requests => Requests.Base;

        public Repository()
        {
            _context = new Context();

        }


        public int SaveChange()
        {
            try
            {

                return _context.SaveChanges();
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("View inner exception to more details", ex.GetBaseException());
            }
        }

        int IRepositotyBase.SaveChange()
        {
            return SaveChange();
        }
    }
}