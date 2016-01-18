using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using GatewayApiClient;
using GatewayApiClient.DataContracts;
using GatewayApiClient.DataContracts.EnumTypes;

namespace TIcket.PayMethod
{
    public class MundiPaggClient
    {
        public MundiPaggClient()
        {
            // Creates the credit card transaction.
            var transaction = new CreditCardTransaction()
            {
                AmountInCents = 100,
                CreditCard = new CreditCard()
                {
                    CreditCardNumber = "4111111111111111",
                    ExpMonth = 10,
                    ExpYear = 2018,
                    SecurityCode = "123",
                    HolderName = "Smith"
                }
            };

            try
            {

                // Creates the client that will send the transaction.
                var serviceClient = new GatewayServiceClient();

                // Authorizes the credit card transaction and returns the gateway response.
                var httpResponse = serviceClient.Sale.Create(transaction);

                // API response code
                Console.WriteLine("Status: {0}", httpResponse.HttpStatusCode);

                var createSaleResponse = httpResponse.Response;
                if (httpResponse.HttpStatusCode == HttpStatusCode.Created)
                {
                    foreach (var creditCardTransaction in createSaleResponse.CreditCardTransactionResultCollection)
                    {
                        Console.WriteLine(creditCardTransaction.AcquirerMessage);
                    }
                }
                else
                {
                    if (createSaleResponse.ErrorReport == null) return;
                    foreach (ErrorItem errorItem in createSaleResponse.ErrorReport.ErrorItemCollection)
                    {
                        Console.WriteLine("Error {0}: {1}", errorItem.ErrorCode, errorItem.Description);
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
        }



    }
}
