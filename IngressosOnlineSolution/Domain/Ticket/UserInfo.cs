using System;
using System.Collections.Generic;

namespace Ticket
{
    public class UserInfo
    {
        private ICollection<Address> _address;

        public string Id { get; set; }

        public ICollection<Address> Address
        {
            get { return _address ?? (_address = new List<Address>()); }
            private set
            {
                _address = value;
            }
        }

        public DateTime BirthDate { get; set; }

        public string Cpf { get; set; }

        public short Gender { get; set; }

        public string Name { get; set; }

        public string Email { get; set; }
    }
}