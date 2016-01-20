using System;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Ticket.Core;
using Ticket.Views.HttpApi.Models;

namespace Ticket.Views.HttpApi.Controllers
{
    [RoutePrefix("api/event")]
    [AllowAnonymous]
    public class EventController : ApiController
    {
        private EventCore _core;

        private EventCore Core => _core ?? (_core = new EventCore());


        // GET api/<controller>
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


        [HttpPost, Route("Pay")]
        public IHttpActionResult Pay([FromBody] RequestModel request)
        {
            try
            {
                Core.BuyAsync(request);
                return Ok("Your request as be processa");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex.GetBaseException());
            }
        }
    }
}