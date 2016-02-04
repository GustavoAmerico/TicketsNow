using System.Text;
using System;
namespace Ticket
{
    /// <summary>Encapsulete message from provider of payment</summary>
    public class PaymentMessage
    {
        /// <summary>Gets and sends HttpStatusCode sends by api</summary>
        public int StatusCode { get; set; }

        /// <summary>Gets and sends decription for message</summary>

        public string Message { get; set; }

        /// <summary>Gets and sends Message code</summary>
        public int MessageCode { get; set; }

        /// <summary>Gets and sends email from user relatead</summary>
        public string Email { get; set; }

        public Guid InstantBuyKey { get; set; }

        /// <summary>Returns a string that represents the current object.</summary>
        /// <returns>A string that represents the current object.</returns>
        /// <filterpriority>2</filterpriority>
        public override string ToString()
        {
            var text = new StringBuilder();
            if (StatusCode != 200)
                text.AppendLine($"ErroCode:{MessageCode} </br> ");
            text.AppendLine(Message);

            return text.ToString();
        }
    }
}
