using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ticket.PayMethod
{
    public interface IOrder
    {
        long AmountInCents { get; }

        string TransactionReference { get; }

        string UserEmail { get;  }
    }
}
