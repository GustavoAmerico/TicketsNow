using System;

namespace Ticket.Core.UnitTest.Model
{
    internal class BuyOnClick : IBuyOnClick
    {
        public BuyOnClick()
        {
            UserId = new Guid("2d0924d6-bc7d-4128-97e0-206cf1ffa832");
            InstantBuyKey = new Guid("EFA1AA88-420A-4D22-B895-D5E64C1C1786");
            Itens = new[] { new RequestItemModel("A2B0E67D-83BD-E511-80B6-00155D012302", 1500.00m, 5) };
        }

        public BuyOnClick(Guid userId, Guid instantBuyKey)
        {
            UserId = UserId;
            InstantBuyKey = instantBuyKey;
            Itens = new[] { new RequestItemModel("A2B0E67D-83BD-E511-80B6-00155D012302", 1500.00m, 5) };
        }


        public BuyOnClick(Guid userId, Guid instantBuyKey, params RequestItemModel[] itens)
        {
            UserId = UserId;
            InstantBuyKey = instantBuyKey;
            Itens = itens;
        }

        public Guid? InstantBuyKey { get; }

        public IRequestItemModel[] Itens { get; }

        public Guid UserId { get; }
    }
}
