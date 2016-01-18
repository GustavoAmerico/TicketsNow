using System;
using System.Web.Http;
using Microsoft.Ajax.Utilities;
using Ticket.Core;

namespace Ticket.Views.WebApi.Controllers
{
    [RoutePrefix("api/event")]
    [System.Web.Http.AllowAnonymous]
    public class EventController : ApiController
    {
        public EventController()
        {

        }
        public EventCore _core = new EventCore();

        // GET api/<controller>
        [HttpGet]
        public IHttpActionResult Get()
        {
            try
            {
                var events = _core.IfNotNull(c => c.AllOpen());
                return Ok(events);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
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

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }
    }
}