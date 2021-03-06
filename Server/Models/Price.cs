using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Models {
    public class Price {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)] // id é a chave única da coleção "products" da base de dados
        public string id { get; set; }
        public string idUser { get; set; }
        public string idSupermarket { get; set; }
        public string idLocation { get; set; }
        public string ean { get; set; }
        public double price { get; set; }
    }
}