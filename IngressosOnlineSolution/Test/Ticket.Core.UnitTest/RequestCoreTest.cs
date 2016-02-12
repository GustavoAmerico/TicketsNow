using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Ticket.Core.UnitTest
{
    [TestClass]
    public class RequestCoreTest
    {
        RequestCore _core;

        [TestInitialize]
        public void Init() => _core = new RequestCore();



        [TestMethod]
        public void BuyOnClickTest()
        {
            var buy = new Model.BuyOnClick();
            _core.Buy(buy);

        }
        [TestMethod]
        public void BuyOnCardTest()
        {
            var buy = new Model.BuyOnCard();
            _core.Buy(buy);

        }
    }
}
