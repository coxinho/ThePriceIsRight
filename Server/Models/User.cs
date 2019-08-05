using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Models {
    // Esta é a classe usada para comunicar com a base de dados
    public class User {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)] // id é a chave única da coleção "users" da base de dados
        public string id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string username { get; set; }
        public bool admin { get; set; }
        public string passwordHash { get; set; }
        public string passwordSalt { get; set; }
        public ShoppingList[] shoppingLists { get; set; }
    }
}