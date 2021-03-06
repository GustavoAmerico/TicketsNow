﻿using System.Diagnostics.Contracts;
using System.Web.Http;
using System.Web.Http.Cors;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;

namespace Ticket.Views.HttpApi
{
    public static class WebApiConfig
    {
        const string HostName = "http://localhost:14020";

        public static void Register(HttpConfiguration config)
        {
            if (config == null) return;

            Contract.EndContractBlock();
            // Web API configuration and services
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));
            // Configure Web API to use only bearer token authentication.

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApiWithParameters",
                routeTemplate: "api/{controller}/{id}",
                defaults: new
                {
                    controller = "Event",
                    id = 1
                }
            );


            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}",
                defaults: new
                {
                    controller = "Event",
                }
            );

            var cors = new EnableCorsAttribute(HostName, "*", "*");
            config.EnableCors(cors);
            config.Formatters.JsonFormatter
                .SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            config.Formatters.Remove(config.Formatters.XmlFormatter);

            //config.Formatters.JsonFormatter.UseDataContractJsonSerializer = true;
        }
    }
}
