namespace Ticket.PayMethod
{
    public class Card
    {
        /// <summary>Gets and sends the number of card</summary>
        public string CreditCardNumber { get; set; }

        /// <summary>Gets and sends security of code from card</summary>
        public string SecurityCode { get; set; }

        /// <summary>gets and sends name printed in card</summary>
        public string HolderName { get; set; }

        public int ExpMonth { get; set; }

        public int ExpYear { get; set; }
    }
}