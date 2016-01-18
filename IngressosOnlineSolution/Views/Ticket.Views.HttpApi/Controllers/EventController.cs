using System;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using Ticket.Core;

using System.Net.Http;
using System.Web;
using System.Web.Http;
using Ticket.Views.HttpApi.Models;

namespace Ticket.Views.WebApi.Controllers
{
    [RoutePrefix("api/event")]
    [System.Web.Http.AllowAnonymous]
    public class EventController : ApiController
    {
        EventCore _core;

        private EventCore Core => _core ?? (_core = new EventCore());

        public EventController()
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }

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

        [HttpGet]
        // GET api/<controller>/5
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        [HttpPost, Route("Pay")]
        public void Pay([FromBody]RequestModel request)
        {

            Core.Buy(request);

            Debug.WriteLine(request);
        }
    }
}