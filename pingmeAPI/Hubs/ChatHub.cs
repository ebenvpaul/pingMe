using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Concurrent;
using pingmeAPI.Services;


namespace pingmeAPI.Hubs
{
    public class ChatHub : Hub
    {
        private static readonly ConcurrentDictionary<string, (string Username, string ConnectionId)> Users = new();
        private static readonly ConcurrentDictionary<string, List<(string Sender, string Message, DateTime Timestamp)>> OfflineMessages = new();
        private readonly UserService _userService;

        public ChatHub(UserService userService)
        {
            _userService = userService;
        }

        // Send message to a specific user
        public async Task SendMessage(string receiverConnectionId, string message)
        {
            var senderUsername = Users[Context.ConnectionId].Username;

            // Check if receiver is online
            if (Users.ContainsKey(receiverConnectionId))
            {
                // User is online, send the message immediately
                await Clients.Client(receiverConnectionId).SendAsync("ReceiveMessage", senderUsername, message, DateTime.UtcNow);
            }
            else
            {
                // User is offline, store the message
                if (!OfflineMessages.ContainsKey(receiverConnectionId))
                {
                    OfflineMessages[receiverConnectionId] = new List<(string Sender, string Message, DateTime Timestamp)>();
                }

                // Add message to offline queue
                OfflineMessages[receiverConnectionId].Add((senderUsername, message, DateTime.UtcNow));
            }
        }

        // Register user and handle sending queued messages if any
        public async Task RegisterUser(string userId)
        {
            var user = await _userService.GetUserbyId(userId);
            if (user != null)
            {
                // Register user in the Users dictionary
                Users[Context.ConnectionId] = (user.Username, Context.ConnectionId);

                // Send any offline messages to the user
                if (OfflineMessages.ContainsKey(Context.ConnectionId))
                {
                    var messages = OfflineMessages[Context.ConnectionId];
                    foreach (var msg in messages)
                    {
                        await Clients.Caller.SendAsync("ReceiveMessage", msg.Sender, msg.Message, msg.Timestamp);
                    }

                    // Clear the messages after sending
                    OfflineMessages.TryRemove(Context.ConnectionId, out _);
                }

                await Clients.All.SendAsync("UserConnected", user.Username);
            }
            else
            {
                // Handle user not found (optional)
                await Clients.Caller.SendAsync("Error", "User not found.");
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if (Users.TryRemove(Context.ConnectionId, out var user))
            {
                await Clients.All.SendAsync("UserDisconnected", user.Username);
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
