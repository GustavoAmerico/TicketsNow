using System.Web.Mvc;

namespace Ticket.Views.HttpApi
{
    using Core;
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new GenericException());
        }

        class GenericException : HandleErrorAttribute
        {
            public override void OnException(ExceptionContext filterContext)
            {

                filterContext.Exception.RegisterException();
                base.OnException(filterContext);
            }
        }
    }



}
