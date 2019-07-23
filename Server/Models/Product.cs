using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Server.Models {
    public class Product {
        [BsonId]
        public string ean { get; set; }
        public string brand { get; set; }
        public string name { get; set; }
        public string photo { get; set; }
    }
}