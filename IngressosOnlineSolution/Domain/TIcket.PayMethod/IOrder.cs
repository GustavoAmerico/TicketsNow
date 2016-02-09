namespace Ticket.PayMethod
{
    public interface IOrder
    {
        long AmountInCents { get; }

        string TransactionReference { get; }

        string UserEmail { get;  }
    }
}
