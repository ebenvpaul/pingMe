using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using pingmeAPI.Models;

namespace pingmeAPI.Repository
{
    public class MessageRepository
    {

        private readonly IMongoCollection<Message> _messageCollection;

        public MessageRepository(IMongoDatabase mongoDatabase)
        {
            _messageCollection = mongoDatabase.GetCollection<Message>("Messages");
        }

        public async Task SaveMessageAsync(Message message)
        {
            await _messageCollection.InsertOneAsync(message);
        }

        public async Task<List<Message>> GetMessageHistoryAsync(string userId, string contactId)
        {
            var filter = Builders<Message>.Filter.And(
                Builders<Message>.Filter.Or(
                    Builders<Message>.Filter.Eq(m => m.SenderId, userId),
                    Builders<Message>.Filter.Eq(m => m.ReceiverId, userId)
                ),
                Builders<Message>.Filter.Or(
                    Builders<Message>.Filter.Eq(m => m.SenderId, contactId),
                    Builders<Message>.Filter.Eq(m => m.ReceiverId, contactId)
                )
            );

            return await _messageCollection.Find(filter).ToListAsync();
        }
    }
}