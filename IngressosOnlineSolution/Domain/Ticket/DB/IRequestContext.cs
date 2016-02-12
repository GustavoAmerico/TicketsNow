using Ticket.Collections;

namespace Ticket.DB
{
    public interface IRequestContext : IRepositotyBase
    {

        UserInfoCollection UsersInfo { get; }

        IEfTable<Request, RequestCollection> Requests { get; }
    }
}