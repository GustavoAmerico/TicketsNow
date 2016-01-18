using System;

namespace Ticket.Core
{
    public interface IRequestModel
    {
        int CardCvv { get; set; }
        string CardNumber { get; set; }
        IRequestItemModel[] Itens { get; }

        string Name { get; set; }
        bool SaveCard { get; set; }
        Guid UserId { get; set; }
        int ValidMonth { get; set; }
        int ValidYear { get; set; }
    }
}