using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using GatewayApiClient;
using GatewayApiClient.DataContracts;
using GatewayApiClient.DataContracts.EnumTypes;

namespace Ticket.PayMethod
{
    public class PayCreditCard : Feed<PaymentMessage>
    {
        private readonly Request _request;

        private readonly CreditCardTransaction _transaction;

        public PayCreditCard(Request request)
        {
            _request = request;
            _transaction = new CreditCardTransaction
            {
                AmountInCents = (long)(request.Total * 100),
                TransactionReference = request.Id.ToString(),
                InstallmentCount = 1,
                //Options = new CreditCardTransactionOptions
                //{TODO: Verificar pra que serve
                //    IsNotificationEnabled = true,
                //    NotificationUrl = Settings.CreditCardoNotification
                //}
            };


        }

        /// <summary>initialize an transiction for payment</summary>
        public void Pay(Card newCard)
        {
            _transaction.CreditCard = newCard.Copiar<Card, CreditCard>();
            _transaction.CreditCard.CreditCardBrand = CreditCardBrandEnum.Mastercard;

            Pay();
        }


        private void Pay(int numbersOfAttempts = 0)
        {

            try
            {
                var key = new Guid("5e62ba71-73d4-4ca0-8c03-26d1f78d6c71");
                const string link = "https://sandbox.mundipaggone.com";
                // Creates the client that will send the transaction.
                var serviceClient = new GatewayServiceClient(key, new Uri(link));


                // Cria requisição.
                var createSaleRequest = new CreateSaleRequest()
                {
                    // Adiciona a transação na requisição.
                    CreditCardTransactionCollection = new Collection<CreditCardTransaction>(new[] { _transaction }),
                    Order = new Order()
                    {
                        OrderReference = _request.Id.ToString()

                    }
                };


                // Authorizes the credit card transaction and returns the gateway response.
                var httpResponse = serviceClient.Sale.Create(createSaleRequest);


                var createSaleResponse = httpResponse.Response;
                switch (httpResponse.HttpStatusCode)
                {
                    case HttpStatusCode.Created:


                        foreach (var msg in createSaleResponse.CreditCardTransactionResultCollection.Select(creditCardTransaction => new PaymentMessage()
                        {
                            Message = creditCardTransaction.AcquirerMessage,
                            StatusCode = (int)httpResponse.HttpStatusCode,
                            Email = _request.User?.Email
                        }))
                        {
                            Notificar(msg);
                        }
                        break;
                    case HttpStatusCode.InternalServerError:
                        if (numbersOfAttempts <= 3)
                            Pay(numbersOfAttempts + 1);
                        else
                            goto default;

                        break;
                    default:
                        if (createSaleResponse.ErrorReport == null) return;
                        var payments =
                            createSaleResponse.ErrorReport.ErrorItemCollection
                            .Select(errorItem => new PaymentMessage()
                            {
                                Message = errorItem.Description,
                                StatusCode = (int)httpResponse.HttpStatusCode,
                                MessageCode = errorItem.ErrorCode,
                                Email = _request.User?.Email
                            }).ToArray();

                        foreach (var msg in payments)
                            Notificar(msg);
                        break;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }

    }
}