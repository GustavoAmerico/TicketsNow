using System;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Threading.Tasks;
using Ticket.DB;
using Ticket.DB.EntityFramework;
using Ticket.PayMethod;

namespace Ticket.Core
{
    public class RequestCore
    {
        private static PaymentMessageServer _messageServer;

        private readonly IRequestContext _context;

        private UserInfo _userFromRequest;

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
        /// <exception cref="InvalidOperationException">Ocorre quando não há itens no pedido</exception>
        public void Buy(IBuyOnCard model)
        {
            var request = SaveRequest(model);
            var card = new CardOfCredit(model);
            Buy(card, request, model.SaveCard);
        }

        /// <exception cref="InvalidOperationException">Ocorre quando não há itens no pedido</exception>
        public void Buy(IBuyOnClick model)
        {
            var user = _context.UsersInfo.FindOrDefault(model.UserId);
            if (user == null)
                throw new InvalidOperationException("User not found");
            if (!user.InstantBuyKey.HasValue)
                throw new InvalidOperationException("You not have an card configution, you need sends  informations from card of credit");

            Contract.EndContractBlock();

            var request = SaveRequest(model);

            var card = new CardOfCredit(request.User.InstantBuyKey.Value);
            Buy(card, request, false);
        }

        /// <summary>makes the purchase of tickets</summary>
        /// <param name="model">Request</param>
        /// <exception cref="InvalidOperationException">Ocorre quando não há itens no pedido</exception>
        public Task BuyAsync(IBuyOnClick model)
        {
            return Task.Factory.StartNew(() => Buy(model));

        }

        /// <summary>makes the purchase of tickets</summary>
        /// <param name="model">Request</param>
        /// <exception cref="InvalidOperationException">Ocorre quando não há itens no pedido</exception>
        public Task BuyAsync(IBuyOnCard model)
        {
            return Task.Factory.StartNew(() => Buy(model));
        }

        /// <summary>filters out requests from a User</summary>
        /// <param name="userId">identification from user</param>
        /// <returns>Filters out requests from a User</returns>
        /// <exception cref="ArgumentNullException">It occurs when the User identifier is not filled</exception>
        public RequestView[] GetByUser(string userId)
        {
            Contract.EnsuresOnThrow<ArgumentNullException>(string.IsNullOrWhiteSpace(userId), "The User identifier can not be null");

            var requests = _context.Requests.Base.Find(userId)
                .Select(r => new RequestView(r))
                .OrderByDescending(x => x.Date)
                .ToArray();

            return requests;
        }

        private void Buy(CardOfCredit card, Request request, bool saveCard)
        {
            card.Subscribe(MessageServer);

            var gateway = new MundiPaggClient();
            gateway.OnCreated += (msg) =>
            {
                if (saveCard)
                {
                    _userFromRequest.InstantBuyKey = msg.InstantBuyKey;
                    _context.SaveChange();
                }
                card.Notificar(msg);
            };
            gateway.OnError += card.Notificar;
            var priceInCents = (long)request.Total * 100;
            gateway.Pay(new Order(priceInCents,
                request.Id.ToString(), _userFromRequest.Email), card);
        }

        /// <exception cref="InvalidOperationException">Ocorre quando não há itens no pedido</exception>
        /// <returns></returns>
        private Request SaveRequest(IBuyOnClick model)
        {
            if (model == null || model.Itens.IsNullOrEmpty())
                throw new InvalidOperationException("Request need ticket(s)");

            Contract.EndContractBlock();

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
                _userFromRequest = _context.UsersInfo.FindOrDefault(model.UserId);
                if (_userFromRequest == null)
                    throw new InvalidOperationException("Not found user selected");
                request.User = _userFromRequest;
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