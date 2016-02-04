using System;

namespace Ticket.Core
{
    public interface IBuyOnClick
    { 
        IRequestItemModel[] Itens { get; }

        Guid UserId { get; }
    }
}
