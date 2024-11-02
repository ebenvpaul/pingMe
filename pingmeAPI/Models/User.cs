using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace pingmeAPI.Models
{
    public class User
    {
        
    [JsonPropertyName("id")]
    public required string Id { get; set; }

    [JsonPropertyName("username")]
    public required string Username { get; set; }

    [JsonPropertyName("passwordHash")]
    public required string PasswordHash { get; set; }

    [JsonPropertyName("connectionId")]
    public required string ConnectionId { get; set; }
    }
}