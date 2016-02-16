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
            var priceInCents = (long)request.Total * 100;
            var order = new Order(priceInCents,
                request.Id.ToString(), _userFromRequest.Email);

            var msg = gateway.Pay(order, card);
            foreach (var message in msg)
            {
                if (saveCard && message.StatusCode == 201)
                    _userFromRequest.InstantBuyKey = message.InstantBuyKey;

                request.StatusId = message.StatusCode;
                card.Notificar(message);
            }
            var resultSave = _context.SaveChange();
            Contract.Assert(resultSave > 0);
        }

        /// <exception cref="InvalidOperationException">Ocorre quando não há itens no pedido</exception>
        /// <returns></returns>
        private Request SaveRequest(IBuyOnClick model)
        {
            var noItens = (model == null || model.Itens.IsNullOrEmpty());
            Contract.EnsuresOnThrow<InvalidOperationException>(noItens, "Request need ticket(s)");

            _userFromRequest = _context.UsersInfo.FindOrDefault(model.UserId);
            Contract.EnsuresOnThrow<InvalidOperationException>(_userFromRequest == null, "Not found user selected");

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