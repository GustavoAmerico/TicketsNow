using System;
using System.Net.Mail;
using System.Runtime.CompilerServices;
namespace Ticket.Core
{
    public static class LogException
    {
        public static void LogAndThrow(this Exception exception,
            [CallerMemberName]string memberName = "",
            [CallerFilePath]string file = "", [CallerLineNumber]int lineNumber = 0)
        {
            SendByEmail($"Error: {exception.GetBaseException()} <br /> from {memberName} <br /> in {file}");
            System.Diagnostics.Contracts.Contract.EnsuresOnThrow<Exception>(true, exception.GetBaseException().Message);

        }


        public static void RegisterException(this Exception exception, [CallerMemberName]string memberName = "", [CallerFilePath]string file = "", [CallerLineNumber]int lineNumber = 0)
        {

            SendByEmail($"Error: {exception.GetBaseException()} from {memberName} in {file}");

        }

        static void SendByEmail(string msg = "")
        {
            if (string.IsNullOrEmpty(msg)) return;
            try
            {
                var smtp = new SmtpClient("smtp.sendgrid.net");
                smtp.SendAsync("noreplay@ticketsnow.net", "contato@gustavoamerico.net", "Erro no TimeNow", msg, Guid.NewGuid().ToString());

            }
            catch (Exception)
            {

            }
        }
    }
}