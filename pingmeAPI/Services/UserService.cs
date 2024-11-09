using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using pingmeAPI.Models;

namespace pingmeAPI.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _users;
        private readonly IConfiguration _configuration;
        public UserService(IOptions<MongoDBSettings> mongoDBSettings,IConfiguration configuration)
        {
            var mongoClient = new MongoClient(mongoDBSettings.Value.ConnectionString);
            var mongoDatabase = mongoClient.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _users = mongoDatabase.GetCollection<User>(mongoDBSettings.Value.UsersCollection);
            _configuration = configuration;
        }

           public async Task<string?> Authenticate(string username, string password)
        {
            // Find the user in MongoDB
            var user = await _users.Find(u => u.Username == username && u.PasswordHash == password).FirstOrDefaultAsync();
            if (user == null)
            {
                return null; // Return null if credentials are invalid
            }
            // Generate JWT token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("UserId", user.Id) // You can add custom claims as needed
                }),
                Expires = DateTime.UtcNow.AddHours(1),
                Issuer = _configuration["JwtSettings:Issuer"],
                Audience = _configuration["JwtSettings:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
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
        public async Task<User> GetUserbyUserNamePassword(string username,string password)
        {
            return await _users.Find(u => u.Username == username && u.PasswordHash == password).FirstOrDefaultAsync();
        }

        public async Task SeedSampleUsersAsync()
        {
            var sampleUsers = new List<User>
        {
            new User { Id = Guid.NewGuid().ToString(), Username = "Alice", PasswordHash = "password1", ConnectionId = "49.206.3.186" },
            new User { Id = Guid.NewGuid().ToString(), Username = "Bob", PasswordHash = "password2", ConnectionId = "49.206.3.186" },
            new User { Id = Guid.NewGuid().ToString(), Username = "Charlie", PasswordHash = "password3", ConnectionId = "49.206.3.186" }
        };

            // Check if the users already exist, and insert them if they don't
            var existingUsers = await GetUsersAsync();
            if (existingUsers.Count == 0)
            {
                await _users.InsertManyAsync(sampleUsers);
            }
        }
        public async Task<bool> DeleteUserAsync(string id)
        {
            var deleteResult = await _users.DeleteOneAsync(user => user.Id == id);
            return deleteResult.DeletedCount > 0;
        }
    }
}