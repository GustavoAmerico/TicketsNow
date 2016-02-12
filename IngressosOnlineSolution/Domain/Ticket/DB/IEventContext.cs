namespace Ticket.DB
{
    using Collections;


    /// <summary>Defines the characteristics of the service provider to events</summary>
    public interface IEventContext : IRepositotyBase
    {
        /// <summary>Gets a List for Events</summary>
        IEfTable<Event, EventCollection> Events { get; }


    }
}
