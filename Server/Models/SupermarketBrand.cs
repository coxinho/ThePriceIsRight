using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Models {
    public class SupermarketBrand {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)] // This is the unique key
        public string id { get; set; }
        public string name  { get; set; }
        public string logo  { get; set; }
    }
}