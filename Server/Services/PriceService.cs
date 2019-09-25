using MongoDB.Driver;
using Server.Models;
using System.Collections.Generic;
using System.Linq;
using Server.Helpers;
using Microsoft.Extensions.Configuration;

namespace Server.Services {
    // CRUD Interface
    public interface IPriceService {
        Price Create(Price price);
        Price Read(string id);
        void Update(Price price);
        void Delete(string id);
    }

    public class PriceService : IPriceService {
        private readonly IMongoCollection<Price> _prices;

        public PriceService(IConfiguration config, IMongoDB settings) {
            var server = new MongoClient(config.GetSection("MongoDB").GetSection("ConnectionString").Value);
            var database = server.GetDatabase(config.GetSection("MongoDB").GetSection("Database").Value);
            _prices = database.GetCollection<Price>(config.GetSection("MongoDB").GetSection("PricesCollectionName").Value);
        }

        public Price Create(Price price) {
            var existsPrice = _prices.Find<Price>(p => p.idSupermarket == price.idSupermarket && p.idLocation == price.idLocation && p.ean == price.ean).FirstOrDefault();
            if(existsPrice != null) { // Make sure this price id doesn't exist yet
                price.id = existsPrice.id;
                Update(price);
            }else {
                _prices.InsertOne(price); // Insert price in the database
            }
            return price;
        }
        
        public Price Read(string id) => _prices.Find<Price>(price => price.id == id).FirstOrDefault(); // Get price by EAN

        // Actualizar price
        public void Update(Price price) {
            // Validar id do priceo
            var p = Read(price.id);
            if(p == null)
                throw new AppException("Price not found");

            // Actualizar priceo que vem da base de dados (em vez do priceo que vem nos argumentos, porque o priceo que vem da base de dados pode ter mais campos do que aqueles que vêm do cliente)
            p.idUser = price.idUser;
            p.price = price.price;
            //prod.Ean = price.Ean; // Não é possível alterar o EAN. Apenas se podem criar priceos novos com um determinado EAN.

            _prices.ReplaceOne(pr => pr.id == price.id, p); // Actualizar priceo na base de dados
        }
        public void Delete(string ean) {
            if(Read(ean) != null) { // Se um priceo com este id existir na base dados
                _prices.DeleteOne(p => p.ean == ean); // Removê-lo da base de dados
            }
        }
    }
}