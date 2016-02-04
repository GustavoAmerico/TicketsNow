namespace Ticket.PayMethod
{
    public sealed class Order : IOrder
    {
        public Order(long amountInCents, string transactionReference, string userEmail)
        {
            AmountInCents = amountInCents;
            TransactionReference = transactionReference;
            UserEmail = userEmail;

        }

        public long AmountInCents { get; }

        public string TransactionReference { get; }

        public string UserEmail { get; }
    }
}
