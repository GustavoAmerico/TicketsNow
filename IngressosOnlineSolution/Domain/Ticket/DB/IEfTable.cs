using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Ticket.Collections;

namespace Ticket.DB
{
    public interface IEfTable<T, TBaseCollection> : ICollection<T>, IQueryable<T>
            where T : class
            where TBaseCollection : BaseCollection<T>
    {

        TBaseCollection Base { get; }

        /// <summary>Included releated type in query</summary>
        IQueryable<T> Include(params Expression<Func<T, object>>[] express);

        T Attach(T entity);

        /// <summary>Disabled track for query</summary>
        IQueryable<T> AsNoTrack();
    }
}
