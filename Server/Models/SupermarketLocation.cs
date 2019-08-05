using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Models {
    public class SupermarketLocation {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)] // id is the unique key to supermarket locations
        public string id { get; set; }
        public string idSupermarketBrand { get; set; }
        public string location  { get; set; }
        public string latitude  { get; set; }
        public string longitude  { get; set; }
    }
}