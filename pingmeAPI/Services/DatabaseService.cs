using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using MongoDB.Bson;
using Microsoft.Extensions.Options;

namespace pingmeAPI.Services
{
    public class DatabaseService
    {
        private readonly IOptions<MongoDBSettings> _mongoDBSettings;
         public DatabaseService(IOptions<MongoDBSettings> mongoDBSettings)
    {
        _mongoDBSettings=mongoDBSettings;
    }
        public bool PingDB()
        {
            var settings = MongoClientSettings.FromConnectionString(_mongoDBSettings.Value.ConnectionString);
            // Set the ServerApi field of the settings object to set the version of the Stable API on the client
            settings.ServerApi = new ServerApi(ServerApiVersion.V1);
            // Create a new client and connect to the server
            var client = new MongoClient(settings);
            // Send a ping to confirm a successful connection
            try
            {
                var result = client.GetDatabase("admin").RunCommand<BsonDocument>(new BsonDocument("ping", 1));
                Console.WriteLine("Pinged your deployment. You successfully connected to MongoDB!");
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
            return false;
        }
    }
}