using System;

namespace Ticket.Core.UnitTest.Model
{
    internal class BuyOnCard : IBuyOnCard
    {
        public BuyOnCard()
        {
            CardCvv = 123;
            CardNumber = "1111111111111111";
            CreditCardBrand = 1;
            InstallmentCount = 1;
            Name = "Gustavo Américo";
            SaveCard = true;
            ValidMonth = 6;
            ValidYear = DateTime.Now.Year + 2;
            UserId = new Guid("2d0924d6-bc7d-4128-97e0-206cf1ffa832");
            Itens = new[] { new RequestItemModel("A2B0E67D-83BD-E511-80B6-00155D012302", 1050.00m, 3) };
        }

        public int CardCvv { get; }

        public string CardNumber { get; }

        public int CreditCardBrand { get; }

        public int InstallmentCount { get; }

        public Guid? InstantBuyKey { get; }

        public IRequestItemModel[] Itens { get; }

        public string Name { get; }

        public bool SaveCard { get; }

        public Guid UserId { get; }

        public int ValidMonth { get; }

        public int ValidYear { get; }

    }
}