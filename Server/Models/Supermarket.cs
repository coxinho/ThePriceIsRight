using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Models {
    public class Supermarket {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)] // id is the unique key to supermarkets
        public string id { get; set; }
        public string name  { get; set; }
        public string location  { get; set; }
        public string latitude  { get; set; }
        public string longitude  { get; set; }
    }
}