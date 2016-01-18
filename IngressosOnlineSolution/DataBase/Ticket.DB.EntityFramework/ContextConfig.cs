using System.Data.Entity.Core.Common;
using System.Data.Entity.SqlServer;
using System.Diagnostics;

namespace Ticket.DB.EntityFramework
{

    internal class ContextConfig : System.Data.Entity.DbConfiguration
    {

        public ContextConfig()
        {


            SetProviderServices(SqlProviderServices.ProviderInvariantName, SqlProviderServices.Instance);

        }


        void Hacker()
        {
            var x = SqlProviderServices.Instance;
            Debug.Write(x);
        }
    }

}