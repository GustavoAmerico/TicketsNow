namespace Ticket.Core
{
    public interface IBuyOnCard : IBuyOnClick
    {
        int CardCvv { get; }

        string CardNumber { get; }

        int CreditCardBrand { get; }

        int InstallmentCount { get; }

        string Name { get; }

        bool SaveCard { get; }

        int ValidMonth { get; }

        int ValidYear { get; }
    }
}