using MongoDB.Driver;
using Server.Models;
using System.Collections.Generic;
using System.Linq;
using Server.Helpers;
using Microsoft.Extensions.Configuration;

namespace Server.Services {
    public interface ISupermarketBrandService {
        SupermarketBrand Create(SupermarketBrand supermarketBrand);
        SupermarketBrand Read(string id);
        List<SupermarketBrand> ReadAll();
        SupermarketBrand Update(SupermarketBrand supermarketBrand);
        string Delete(string id);
    }

    public class SupermarketBrandService : ISupermarketBrandService {
        private readonly IMongoCollection<SupermarketBrand> _supermarketBrands;

        public SupermarketBrandService(IConfiguration config, IMongoDB settings) {
            var server = new MongoClient(config.GetSection("MongoDB").GetSection("ConnectionString").Value);
            var database = server.GetDatabase(config.GetSection("MongoDB").GetSection("Database").Value);
            _supermarketBrands = database.GetCollection<SupermarketBrand>(config.GetSection("MongoDB").GetSection("SupermarketBrandsCollectionName").Value);
        }

        public SupermarketBrand Create(SupermarketBrand supermarketBrand) {
            if(Read(supermarketBrand.id) != null) // Make sure this doesn't exist on the database yet
                throw new AppException("A supermarket brand with id \"" + supermarketBrand.id + "\" is already registered.");
            _supermarketBrands.InsertOne(supermarketBrand); // Call the service
            return supermarketBrand;
        }

        public SupermarketBrand Read(string id) => _supermarketBrands.Find<SupermarketBrand>(supermarketBrand => supermarketBrand.id == id).FirstOrDefault(); // Get supermarket by id

        // Get all objects from database
        public List<SupermarketBrand> ReadAll() => _supermarketBrands.Find(supermarketBrand => true).ToList();

        // Update object in database
        public SupermarketBrand Update(SupermarketBrand supermarketBrand) {
            // Validate object in database
            var superBrand = Read(supermarketBrand.id);
            if(superBrand == null)
                throw new AppException("Supermarket brand not found");

            // Update supermarket brand fields on the object that comes from the database, because it may contain more fields which we want to keep as is.
            superBrand.name = supermarketBrand.name;
            superBrand.logo = supermarketBrand.logo;

            _supermarketBrands.ReplaceOne(s => s.id == superBrand.id, superBrand); // Update supermarket brand on the database
            return superBrand;
        }
        public string Delete(string id) {
            if(Read(id) == null)
                throw new AppException("Supermarket brand id not found");
            _supermarketBrands.DeleteOne(s => s.id == id); // Remove it
            return id;
        }
    }
}