using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Entities
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public bool Admin { get; set; }
        public string PasswordHash { get; set; }
        public string PasswordSalt { get; set; }
    }
}