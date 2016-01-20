using System;

namespace Ticket
{
    /// <summary>Abstract the information about address of the user</summary>
    public class Address
    {

        /// <summary>Gets and sends city name of residence</summary>
        public string City { get; set; }

        public Guid Id { get; set; } = Guid.NewGuid();

        /// <summary>Gets and sends State/Province name of residence</summary>
        public string State { get; set; }

        /// <summary>Gets and sends street name of residence</summary>
        public string Street { get; set; }

        /// <summary>Gets and sends identification of user associate</summary>
        public string User_Id { get; set; }

        /// <summary>Gets and sends postal code of residence</summary>
        public string ZipCode { get; set; }
    }
}