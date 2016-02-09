using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Ticket.Core.UnitTest
{
    [TestClass]
    public class EventCoreTest
    {
        [TestMethod]
        public void GetAllOpenEvent()
        {

            var core = new EventCore();
            var events = core.AllOpen();
            Assert.IsTrue(events.Any(), "Not have itens in collection");

            Assert.IsTrue(events.All(e => e.Status == EventStatus.Open), "Not all events are open");

        }
    }
}
