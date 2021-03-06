﻿using System.Diagnostics.Contracts;
using System.Web.Mvc;

namespace Ticket.Views.HttpApi
{
    public class FilterConfig
    {
        private FilterConfig() { }

        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            if (filters == null) return;

            Contract.EndContractBlock();

            filters.Add(new GenericException());
        }

        internal sealed class GenericException : HandleErrorAttribute
        {
            public override void OnException(ExceptionContext filterContext)
            {
                if (filterContext == null) return;

                Contract.EndContractBlock();
                filterContext.Exception.RegisterException();
                base.OnException(filterContext);
            }
        }
    }



}
