using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using pingmeAPI.Models;

namespace pingmeAPI.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;

    public UserService(IOptions<MongoDBSettings> mongoDBSettings)
    {
        var mongoClient = new MongoClient(mongoDBSettings.Value.ConnectionString);
        var mongoDatabase = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
        _users = mongoDatabase.GetCollection<User>(mongoDBSettings.Value.UsersCollection);
    }

    public async Task<User> CreateUserAsync(User user)
    {
        await _users.InsertOneAsync(user);
        return user;
    }

    public async Task<List<User>> GetUsersAsync()
    {
        return await _users.Find(user => true).ToListAsync();
    }
    public async Task<User> GetUserbyId(string id)
    {
        return await _users.Find(user => user.Id == id).FirstOrDefaultAsync();
    }

    public async Task SeedSampleUsersAsync()
    {
        var sampleUsers = new List<User>
        {
            new User { Id = "1", Username = "Alice", PasswordHash = "password1", ConnectionId = "conn1" },
            new User { Id = "2", Username = "Bob", PasswordHash = "password2", ConnectionId = "conn2" },
            new User { Id = "3", Username = "Charlie", PasswordHash = "password3", ConnectionId = "conn3" }
        };

        // Check if the users already exist, and insert them if they don't
        var existingUsers = await GetUsersAsync();
        if (existingUsers.Count == 0)
        {
            await _users.InsertManyAsync(sampleUsers);
        }
    }   
    }
}