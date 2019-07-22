using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Models {
    public class ShoppingList {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)] // id é a chave única da coleção "products" da base de dados
        public string id { get; set; }
        public string name { get; set; }
        public int order { get; set; }
        public Product[] products { get; set; }
    }
}