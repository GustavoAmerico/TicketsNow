using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ticket
{
    public class Request
    {
        /// <summary>Gets and sends the identification</summary>
        public Guid Id { get; set; }

        /// <summary>Gets and sends the identification of <see cref="UserInfo"/></summary>
        public string UserId { get; set; }

        public UserInfo User { get; set; }

        /// <summary>gets and sends the date it was created</summary>
        public DateTime Date { get; private set; } = DateTime.Now;

        public ICollection<RequestItem> Itens { get; set; }

        public Request()
        {

        }

        public Request(params RequestItem[] itens)
        {
            Itens = itens;
        }
    }
}
