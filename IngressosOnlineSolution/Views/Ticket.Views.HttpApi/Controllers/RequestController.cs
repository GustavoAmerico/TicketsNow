using System;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Ticket.Core;
using Ticket.Views.HttpApi.Models;

namespace Ticket.Views.HttpApi.Controllers
{
    [RoutePrefix("api/Request"), Authorize]

    public class RequestController : ApiController
    {
        private RequestCore _core;

        private RequestCore Core => _core ?? (_core = new RequestCore());


        [HttpGet, Route]
        public HttpResponseMessage Get()
        {
            try
            {
                var userId = User.Identity.GetUserId<string>();

                var events = Core.GetByUser(userId);

                return Request.CreateResponse(HttpStatusCode.OK, events);
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, ex.GetBaseException().Message);
            }
        }

        [HttpPost, Route("BuyOnClick")]
        public async Task<IHttpActionResult> BuyOnClick([FromBody] RequestOnClickModel request)
        {
            if (request == null || !ModelState.IsValid)
                return BadRequest("your request is invalid, check required field");

            var id = User.Identity.GetUserId<string>();
            request.UserId = new Guid(id);
            try
            {

                await Core.BuyAsync(request);

            }
            catch (InvalidOperationException ex)
            {

                return BadRequest(ex.GetBaseException().Message);
            }
            return Ok("Your request has been successfully processed and send your email");

        }

        [HttpPost, Route]
        public async Task<IHttpActionResult> Post([FromBody] RequestModel request)
        {
            try
            {
                if (request == null || !ModelState.IsValid)
                    return BadRequest("your request is invalid, check required field");

                var id = User.Identity.GetUserId<string>();
                request.UserId = new Guid(id);

                await Core.BuyAsync(request);
                return Ok("Your request has been successfully processed and send your email");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex.GetBaseException());
            }
        }
    }
}