using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Ticket.Core.UnitTest
{
    [TestClass]
    public class EventCoreTest
    {

        EventCore _core;

        [TestInitialize]
        public void Init()
        {
            _core = new EventCore();
        }


        [TestMethod]
        public void GetAllOpenEvent()
        {
            var events = _core.AllOpen();
            Assert.IsTrue(events.Any(), "Not have itens in collection");
            Assert.IsTrue(events.All(e => e.Status == EventStatus.Open), "Not all events are open");

        }
    }
}
