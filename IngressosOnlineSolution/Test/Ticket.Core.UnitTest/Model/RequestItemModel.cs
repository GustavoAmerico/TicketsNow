using System;

namespace Ticket.Core.UnitTest.Model
{
    public class RequestItemModel : IRequestItemModel
    {

        public RequestItemModel(Guid id, decimal price, int qtd)
        {
            Id = id;
            Price = price;
            Qtd = qtd;

        }
        public RequestItemModel(string id, decimal price, int qtd)
        {
            Id = new Guid(id);
            Price = price;
            Qtd = qtd;

        }

        public Guid Id { get; }

        public decimal Price { get; }

        public int Qtd { get; }
    }
}
