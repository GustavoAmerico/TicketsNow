using System;
using System.Collections.Generic;
using System.Linq;
using Contract = System.Diagnostics.Contracts.Contract;
namespace Ticket.Collections
{
    public class RequestCollection : BaseCollection<Request>
    {
        public RequestCollection()
        {

        }

        public RequestCollection(ICollection<Request> events) : base(events)
        {
        }

        public override bool Add(Request item)
        {
            if (item == null)
                throw new ArgumentNullException(nameof(item), "the request is null");

            if (item.Itens.IsNullOrEmpty())
                throw new ArgumentException("Every request need items");

            if (string.IsNullOrWhiteSpace(item.UserId))
                throw new InvalidOperationException("The request does not have an associated user");

            Contract.EndContractBlock();

            foreach (var requestItem in item.Itens)
            {
                requestItem.Request = item;
                requestItem.RequestId = item.Id;
            }



            return base.Add(item);
        }

        /// <summary>filters out requests from a User</summary>
        /// <param name="userId">identification from user</param>
        /// <returns>Filters out requests from a User</returns>
        /// <exception cref="ArgumentNullException">It occurs when the User identifier is not filled</exception>
        public RequestCollection Find(string userId)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentNullException("userId", "The User identifier can not be null");

            return this.Where(r => r.UserId == userId)
                                 .ToArray();

        }

        public static implicit operator RequestCollection(Request[] request)
        {
            return new RequestCollection(request);
        }

    }
}