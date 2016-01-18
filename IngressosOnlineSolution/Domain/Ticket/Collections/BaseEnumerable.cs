using System.Collections;
using System.Collections.Generic;

namespace Ticket.Collections
{
    /// <summary>Exposes the enumerator, which supports a simple iteration over a collection of a specified type.</summary>
    /// <typeparam name="T">The type of objects to enumerate</typeparam>
    public abstract class BaseEnumerable<T> : IEnumerable<T>
    {
        /// <summary>Itens of Enumerable</summary>
        protected virtual IEnumerable<T> Itens { get; }

        /// <summary>create an Itens for <seealso cref="T"/></summary>
        protected BaseEnumerable() : this(new T[0])
        {

        }

        /// <summary>encapsulates an existing enumerator</summary>
        /// <param name="itens">existing enumerator</param>
        protected BaseEnumerable(IEnumerable<T> itens)
        {
            Itens = itens;
        }

        IEnumerator IEnumerable.GetEnumerator()
        {
            return GetEnumerator();
        }

        /// <summary>Returns an enumerator that iterates through the collection. </summary>
        /// <returns>
        /// A <see cref="T:System.Collections.Generic.IEnumerator`1"/> that can be used to iterate through the collection.</returns> 
        public IEnumerator<T> GetEnumerator()
        {
            return Itens.GetEnumerator();
        }

    }
}