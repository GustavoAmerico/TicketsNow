using System;
using System.Collections.Generic;
using System.Linq;

namespace Ticket
{
    using Collections;
    public class Request
    {
        private RequestItemCollection _itens;

        /// <summary>Gets and sends the identification</summary>
        public Guid Id { get; set; } = Guid.NewGuid();

        /// <summary>Gets and sends the identification of <see cref="UserInfo"/></summary>
        public virtual string UserId { get; set; }

        public virtual UserInfo User { get; set; }

        /// <summary>Gets and sends total all itens</summary>
        public decimal Total => Itens.Sum(i => (i.PriceForRequest * i.NumberOfItens));

        /// <summary>gets and sends the date it was created</summary>
        public DateTime Date { get; private set; } = DateTime.Now;

        public virtual RequestItemCollection Itens
        {
            get { return _itens ?? (_itens = new RequestItemCollection()); }
            set { _itens = value; }
        }

        public Request()
        {

        }

        public Request(params RequestItem[] itens)
        {
            Itens = itens;
        }

        public bool Any()
        {
            throw new NotImplementedException();
        }
    }
}
