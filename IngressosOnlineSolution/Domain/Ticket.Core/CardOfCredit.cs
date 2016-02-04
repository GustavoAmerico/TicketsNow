using System;

namespace Ticket.Core
{

    using PayMethod;

    internal class CardOfCredit : Feed<PaymentMessage>, ICreditCard
    {
        int _installmentCount = 1;

        public int? CreditCardBrand { get; set; }

        public string CreditCardNumber { get; set; }

        public int ExpMonth { get; set; }

        public int ExpYear { get; set; }

        public string HolderName { get; set; }

        public int InstallmentCount
        {
            get { return _installmentCount; }
            set
            {
                if (value <= 0 || value >= 12)
                    throw new ArgumentOutOfRangeException("the number of shares must be greater than zero and less than 13");
                _installmentCount = value;
            }
        }

        public Guid? InstantBuyKey { get; set; }

        public string SecurityCode { get; set; }

        public CardOfCredit()
        {
        }

        public CardOfCredit(IBuyOnCard model)
        {
            CreditCardBrand = model.CreditCardBrand;
            CreditCardNumber = model.CardNumber;
            ExpMonth = model.ValidMonth;
            ExpYear = model.ValidYear.ToString()
                .Substring(2)
                .ToInt32();
            HolderName = model.Name;
            InstallmentCount = model.InstallmentCount;
            SecurityCode = model.CardCvv.ToString();
            if (model.InstantBuyKey != null && model.InstantBuyKey != new Guid())
                InstantBuyKey = model.InstantBuyKey;
        }

        public CardOfCredit(Guid instantBuyKey)
        {
            InstallmentCount = 1;
            InstantBuyKey = instantBuyKey;
        }

    }
}