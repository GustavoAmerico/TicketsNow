using System.Data.Entity;
using System.Data.Entity.SqlServer;

namespace Ticket.DB.EntityFramework
{
    /// <summary>Configuration database provider</summary>
    public class ContextConfig : DbConfiguration
    {
        /// <summary>Initialize o service to database provider</summary>
        public ContextConfig()
        {
            SetProviderServices(SqlProviderServices.ProviderInvariantName, SqlProviderServices.Instance);
        }
    }
}