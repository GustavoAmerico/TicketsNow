using System;

namespace Ticket.PayMethod
{
    public interface ICreditCard
    {
        int? CreditCardBrand { get; }

        string CreditCardNumber { get; }

        int ExpMonth { get; }

        int ExpYear { get; }

        string HolderName { get; }

        Guid? InstantBuyKey { get; }

        string SecurityCode { get; }

        int InstallmentCount { get; }
    }
}