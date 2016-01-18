using System;

namespace Ticket.Core
{
    public interface IRequestItemModel
    {
        Guid Id { get; }
        decimal Price { get; }

        int Qtd { get; }
    }
}