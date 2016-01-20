using System;
using System.Collections.Generic;
using System.Linq;

namespace Ticket.Collections
{
    public class UserInfoCollection : BaseCollection<UserInfo>
    {
        public UserInfoCollection()
        {

        }

        public UserInfoCollection(ICollection<UserInfo> events) : base(events)
        {
        }

        /// <summary>search for the item that matches the <see cref="id"/></summary>
        /// <param name="id"></param>
        /// <returns></returns>
        public UserInfo FindOrDefault(Guid id)
        {
            var itemId = id.ToString();
            return this.FirstOrDefault(x => x.Id == itemId);
        }

        public static implicit operator UserInfoCollection(UserInfo[] events)
        {
            return new UserInfoCollection(events);
        }

    }
}