public class MongoDBSettings
{
    public required string ConnectionString { get; set; }  // Required
    public required string DatabaseName { get; set; }      // Required
    public required string UsersCollection { get; set; }   // Required
}
