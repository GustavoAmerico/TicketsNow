using System.Collections.Generic;

namespace Ticket.Collections
{
    public abstract class BaseCollection<T> : BaseEnumerable<T>, ICollection<T>
    {
        /// <summary>Gets the number of elements</summary>
        public int Count => Colecao.Count;

        /// <summary>Gets a value indicating whether is read-only.</summary>
        public virtual bool IsReadOnly => Colecao.IsReadOnly;

        private ICollection<T> Colecao => Itens as ICollection<T>;

        /// <summary>create an enumerable for <seealso cref="T" /></summary>
        protected BaseCollection() : this(new HashSet<T>())
        {
        }

        protected BaseCollection(ICollection<T> list) : base(list)
        {
        }

        /// <summary>Adiciona o item junto da coleção</summary>
        /// <param name="item">item a ser adicionado</param>
        /// <returns>retorna true se o item foi adicionado se não false</returns>
        public virtual bool Add(T item)
        {
            Colecao.Add(item);
            return true;
        }

        /// <summary>Remove all itens</summary>
        public virtual void Clear() => Colecao.Clear();

        public bool Contains(T item) => Colecao.Contains(item);

        /// <summary>Copies the elements of the Collection to an System.Array,
        ///     starting at a particular System.Array index.</summary>
        /// <param name="array"> the destination of the elements copied</param>
        /// <param name="arrayIndex">The zero-based index in array at which copying begins.</param>
        public void CopyTo(T[] array, int arrayIndex)
        {
            Colecao.CopyTo(array, arrayIndex);
        }

        /// <summary>
        ///     Adiciona <paramref name="item" /> junto aos itens
        ///     da coleção
        /// </summary>
        /// <param name="item">Item que deve ser adicionado</param>
        /// <returns>
        ///     Retorna true se satisfazer as condições e for
        ///     adicionado
        /// </returns>
        void ICollection<T>.Add(T item) => Add(item);

        void ICollection<T>.Clear() => Clear();

        /// <summary> Removes the first occurrence of a specific object </summary>
        /// <param name="item">The object to remove </param>
        /// <returns>true if item was successfully removed otherwise, false.</returns>
        /// <remarks>This method also returns false if item is not found</remarks>
        public virtual bool Remove(T item) => Colecao.Remove(item);
    }
}