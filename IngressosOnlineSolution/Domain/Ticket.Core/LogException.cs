using System;

namespace Ticket.Core
{
    public static class LogException
    {
        public static void LogAndThrow(this Exception exception)
        {
            //TODO: Implementar log de exception descionhecido
            System.Diagnostics.Contracts.Contract.EnsuresOnThrow<Exception>(true, exception.GetBaseException().Message);


        }
    }
}