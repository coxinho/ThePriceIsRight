using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Entities {
    public class Product {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)] // id é a chave única da coleção "products" da base de dados
        public string Id { get; set; }
        public string Ean { get; set; }
        public string Brand { get; set; }
        public string Name { get; set; }
        public string Photo { get; set; }
        /*public Supermarkets Supermarkets { get; set; } */
        public float Continente { get; set; }
        public float Lidl { get; set; }
        public float PingoDoce { get; set; }
        public float Intermarche { get; set; }
        public float Jumbo { get; set; }
        public float Dia { get; set; }
    }
}