using Ticket.Collections;

namespace Ticket.DB
{
    public interface IRequestContext : IRepositotyBase
    {

        UserInfoCollection UsersInfo { get; }

        RequestCollection Requests { get; }
    }
}