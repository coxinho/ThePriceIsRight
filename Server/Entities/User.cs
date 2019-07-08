using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Entities {
    // Esta é a classe usada para comunicar com a base de dados
    public class User {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)] // id é a chave única da coleção "users" da base de dados
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public bool Admin { get; set; }
        public string PasswordHash { get; set; }
        public string PasswordSalt { get; set; }
    }
}