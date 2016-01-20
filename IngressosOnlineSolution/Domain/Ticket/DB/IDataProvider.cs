namespace Ticket.DB
{
    public interface IDataProvider
    {

        /// <summary>Relead all data from database</summary>
        /// <typeparam name="T">type from object</typeparam>
        /// <param name="item">object to reload</param>
        /// <remarks>the <see cref="item"/>The item should be part of the context</remarks>
        void Reload<T>(T item) where T : class;

    }
}
