using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pingmeAPI.Models
{
    public class Message
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string SenderId { get; set; }
        public required string ReceiverId { get; set; }
        public required string Content { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public bool IsDelivered { get; set; } = false;
    }
}