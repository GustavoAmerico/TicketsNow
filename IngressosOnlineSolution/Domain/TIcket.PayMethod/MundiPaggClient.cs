using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Net;
using GatewayApiClient;
using GatewayApiClient.DataContracts;

namespace Ticket.PayMethod
{
    public class MundiPaggClient
    { 
        private GatewayServiceClient _serviceClient;

        public MundiPaggClient()
        {
         //   var key = new Guid("5e62ba71-73d4-4ca0-8c03-26d1f78d6c71");
       //     const string link = "https://sandbox.mundipaggone.com";
            // Creates the client that will send the transaction.
            _serviceClient = new GatewayServiceClient();
        }

        public IEnumerable<PaymentMessage> Pay(IOrder order, params ICreditCard[] cards)
        {
            var transictions = new Collection<CreditCardTransaction>(Generate(order, cards)
                .ToArray());

            // Cria requisição.
            var createSaleRequest = GenerateSaleRequest(order, transictions, null);

            // Authorizes the credit card transaction and returns the gateway response.
            var httpResponse = _serviceClient.Sale.Create(createSaleRequest);

            var createSaleResponse = httpResponse.Response;

            switch (httpResponse.HttpStatusCode)
            {
                case HttpStatusCode.Created:
                    {
                        var feedBack = createSaleResponse
                            .CreditCardTransactionResultCollection
                            .Select(creditCardTransaction => new PaymentMessage()
                            {
                                Message = creditCardTransaction.AcquirerMessage,
                                StatusCode = (int)httpResponse.HttpStatusCode,
                                Email = order.UserEmail,
                                InstantBuyKey = creditCardTransaction.CreditCard.InstantBuyKey

                            });
                        return feedBack.ToArray();

                    }
       
                default:
                    {
                        var payments = createSaleResponse.ErrorReport
                            .ErrorItemCollection
                            .Select(errorItem => new PaymentMessage()
                                            {
                                                Message = errorItem.Description,
                                                StatusCode = (int)httpResponse.HttpStatusCode,
                                                MessageCode = errorItem.ErrorCode,
                                                Email = order.UserEmail
                                            })
                             .ToArray();
                        return payments;
                    }
            }

        }


        private IEnumerable<CreditCardTransaction> Generate(IOrder order, ICreditCard[] cards)
        {
            if (cards.IsNullOrEmpty()) yield break;
            var countCard = cards.Count();
            foreach (var card in cards)
            {
                var transaction = new CreditCardTransaction
                {
                    /*Divide o total da compra pelo número de cartões enviados*/
                    AmountInCents = order.AmountInCents / countCard,
                    TransactionReference = order.TransactionReference,
                    InstallmentCount = card.InstallmentCount
                };
                if (card.InstantBuyKey.HasValue && card.InstantBuyKey.Value != Guid.Empty)
                {
                    transaction.CreditCard = new CreditCard()
                    {
                        InstantBuyKey = card.InstantBuyKey.Value
                    };
                    yield return transaction;
                    continue;
                }
                transaction.CreditCard = card.Copiar<ICreditCard, CreditCard>();
                Contract.Assert(card.CreditCardBrand.HasValue);
                GatewayApiClient.DataContracts.EnumTypes.CreditCardBrandEnum brand;
                Enum.TryParse(card.CreditCardBrand.GetValueOrDefault().ToString(), true, out brand);
                transaction.CreditCard.CreditCardBrand = brand;
                yield return transaction;
            }
        }

        /// <summary>Cria requisição.</summary>
        private CreateSaleRequest GenerateSaleRequest(IOrder order, Collection<CreditCardTransaction> cardTransictions, Collection<BoletoTransaction> boletoTransaction)
        {
            if (cardTransictions.IsNullOrEmpty() && boletoTransaction.IsNullOrEmpty())
                throw new InvalidOperationException("É necessario enviar uma transação");

            var createSaleRequest = new CreateSaleRequest()
            {
                Order = new GatewayApiClient.DataContracts.Order()
                {
                    OrderReference = order.TransactionReference
                }
            };

            if (!cardTransictions.IsNullOrEmpty())
                createSaleRequest.CreditCardTransactionCollection = cardTransictions;

            if (!boletoTransaction.IsNullOrEmpty())
                createSaleRequest.BoletoTransactionCollection = boletoTransaction;

            return createSaleRequest;
        }

        private void InternalServerError()
        { }
    }
}