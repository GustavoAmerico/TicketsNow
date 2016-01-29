using System;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Ticket.DB;
using Ticket.DB.EntityFramework;
using Ticket.PayMethod;

namespace Ticket.Core
{
    internal class RequestCore
    {
        private static PaymentMessageServer _messageServer;
        private readonly IRequestContext _context;

        /// <summary>Observador de transações</summary>
        internal static PaymentMessageServer MessageServer
            => _messageServer ?? (_messageServer = new PaymentMessageServer());

        public RequestCore(IRequestContext context)
        {
            _context = context;
        }

        public RequestCore()
        {
            _context = new Repository();
        }

        /// <summary>makes the purchase of tickets</summary>
        /// <param name="model">Request</param>
        public void Buy(IRequestModel model)
        {
            var request = SaveRequest(model);
            if (request == null)
                throw new InvalidOperationException("Request need ticket(s)");
            var creditCard = new PayCreditCard(request);
            creditCard.Subscribe(MessageServer);
            // creditCard.Payment += actor.Tell;

            var card = new Card
            {
                CreditCardNumber = model.CardNumber,
                ExpMonth = model.ValidMonth,
                ExpYear = model.ValidYear.ToString().Substring(2).ToInt32(),
                HolderName = model.Name,
                SecurityCode = model.CardCvv.ToString()
            };

            creditCard.Pay(card);
        }

        /// <summary>makes the purchase of tickets</summary>
        /// <param name="model">Request</param>
        public Task BuyAsync(IRequestModel model)
        {
            return Task.Factory.StartNew(() => Buy(model));
        }

        private Request SaveRequest(IRequestModel model)
        {
            if (model == null || model.Itens.IsNullOrEmpty())
                return null;

            var itens = model.Itens
                .Select(x => new RequestItem
                {
                    EventId = x.Id,
                    PriceForRequest = x.Price,
                    NumberOfItens = x.Qtd
                }).ToArray();

            var request = new Request(itens) { UserId = model.UserId.ToString() };

            try
            {
                var user = _context.UsersInfo.FindOrDefault(model.UserId);
                if (user == null)
                    throw new InvalidOperationException("Not found user selected");
                request.User = user;
                _context.Requests.Add(request);

                var result = _context.SaveChange();

                return request;
            }
            catch (Exception ex)
            {
                ex.LogAndThrow();
                throw;
            }
        }
    }
}