using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Ticket.Core;

namespace Ticket.Views.HttpApi.Controllers
{
    [RoutePrefix("api/event"), Authorize]
    public class EventController : ApiController
    {
        private EventCore _core;

        private EventCore Core => _core ?? (_core = new EventCore());


        // GET api/<controller>
        [AllowAnonymous]
        [HttpGet]
        public HttpResponseMessage Get()
        {
            try
            {
                var events = Core.AllOpen();
                return Request.CreateResponse(HttpStatusCode.OK, events);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.GetBaseException().Message);
            }
        }
    }
}