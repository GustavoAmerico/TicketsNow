using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using Ticket.Collections;

namespace Ticket.DB.EntityFramework
{
    /// <summary>Capsule for internal classes from entityFramework</summary>
    /// <typeparam name="T">Specific type of element in data source</typeparam>
    /// <typeparam name="TBaseCollection">Collection with logic data base type</typeparam>
    public class EfTable<T, TBaseCollection> : BaseEnumerable<T>, ICollection<T>, IQueryable<T>
        where T : class
        where TBaseCollection : BaseCollection<T>

    {
        /// <summary>Provider que compoem a coleção</summary>
        protected internal readonly DbSet<T> Provider;

        /// <summary>Obtém o total de itens na lista</summary>
        public int Count => Provider.Count();

        Type IQueryable.ElementType => ((IDbSet<T>)Provider).ElementType;

        Expression IQueryable.Expression => ((IDbSet<T>)Provider).Expression;

        IQueryProvider IQueryable.Provider => ((IDbSet<T>)Provider).Provider;

        /// <summary>Obtém e envia um valor indicando se a coleção é somente leitura ou não</summary>
        public bool IsReadOnly => false;

        public TBaseCollection Base;


        /// <summary>Initialize Collection Querably to type <see cref="T"/></summary>
        /// <param name="list">Database table provider</param>
        /// <param name="constructor">Function to initializer Collection wiht logic from <see cref="T"/></param>
        internal EfTable(DbSet<T> list, Func<ICollection<T>, TBaseCollection> constructor) : base(list)
        {
            Provider = list;
            Base = constructor(this);
        }

        /// <summary>Add item in collection</summary>
        /// <param name="item"></param>

        public void Add(T item)
        {
            Provider.Add(item);
        }

        /// <summary>Disabled track for query</summary>
        /// <returns></returns>
        public IQueryable<T> AsNoTrack()
        {
            return Provider.AsNoTracking();
        }

        public T Attach(T entity)
        {
            return Provider.Attach(entity);
        }

        /// <summary>Removes all items from the <see cref="T:System.Collections.Generic.ICollection`1"/>.
        /// </summary>
        /// <exception cref="T:System.NotSupportedException">The <see cref="T:System.Collections.Generic.ICollection`1"/> is read-only. </exception>
        public void Clear()
        {
            throw new InvalidOperationException("Operação não suportada");
        }

        /// <summary>Determines whether the <see cref="T:System.Collections.Generic.ICollection`1"/> contains a specific value.</summary>
        /// <returns>true if <paramref name="item"/> is found in the <see cref="T:System.Collections.Generic.ICollection`1"/>; otherwise, false.</returns>
        /// <param name="item">The object to locate in the <see cref="T:System.Collections.Generic.ICollection`1"/>.</param>
        public bool Contains(T item)
        {
            return Provider.Contains(item);
        }

        /// <summary>Copies the elements of the <see cref="T:System.Collections.Generic.ICollection`1"/> to an <see cref="T:System.Array"/>, starting at a particular <see cref="T:System.Array"/> index.</summary>
        /// <param name="array">The one-dimensional <see cref="T:System.Array"/> that is the destination of the elements copied from <see cref="T:System.Collections.Generic.ICollection`1"/>. The <see cref="T:System.Array"/> must have zero-based indexing.</param><param name="arrayIndex">The zero-based index in <paramref name="array"/> at which copying begins.</param><exception cref="T:System.ArgumentNullException"><paramref name="array"/> is null.</exception><exception cref="T:System.ArgumentOutOfRangeException"><paramref name="arrayIndex"/> is less than 0.</exception><exception cref="T:System.ArgumentException">The number of elements in the source <see cref="T:System.Collections.Generic.ICollection`1"/> is greater than the available space from <paramref name="arrayIndex"/> to the end of the destination <paramref name="array"/>.</exception>
        public void CopyTo(T[] array, int arrayIndex)
        {
            Provider.ToArray().CopyTo(array, arrayIndex);
        }

        /// <summary>Included releated type in query</summary>
        public IQueryable<T> Include(params Expression<Func<T, object>>[] express)
        {

            if (express == null) return Provider;
            IQueryable<T> query = Provider;
            foreach (var item in express)
                query = query.Include(item);
            return query;
        }

        /// <summary>Removes the first occurrence of a specific object from the <see cref="T:System.Collections.Generic.ICollection`1"/>.</summary>
        /// <returns>
        /// true if <paramref name="item"/> was successfully removed from the <see cref="T:System.Collections.Generic.ICollection`1"/>; otherwise, false. This method also returns false if <paramref name="item"/> is not found in the original <see cref="T:System.Collections.Generic.ICollection`1"/>.
        /// </returns>
        /// <param name="item">The object to remove from the <see cref="T:System.Collections.Generic.ICollection`1"/>.</param><exception cref="T:System.NotSupportedException">The <see cref="T:System.Collections.Generic.ICollection`1"/> is read-only.</exception>
        public bool Remove(T item) => Provider.Remove(item) != null;
    }
}