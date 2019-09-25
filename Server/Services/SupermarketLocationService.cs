using MongoDB.Driver;
using Server.Models;
using System.Collections.Generic;
using System.Linq;
using Server.Helpers;
using Microsoft.Extensions.Configuration;

namespace Server.Services {
    public interface ISupermarketLocationService {
        SupermarketLocation Create(SupermarketLocation supermarketLocation);
        SupermarketLocation Read(string id);
        List<SupermarketLocation> Search(string supermarketId, string search);
        void Update(SupermarketLocation supermarketLocation);
        void Delete(string id);
    }

    public class SupermarketLocationService : ISupermarketLocationService {
        private readonly IMongoCollection<SupermarketLocation> _supermarketLocations;

        private ISupermarketBrandService _supermarketBrandService;

        public SupermarketLocationService(IConfiguration config, IMongoDB settings, ISupermarketBrandService supermarketBrandService) {
            var server = new MongoClient(config.GetSection("MongoDB").GetSection("ConnectionString").Value);
            var database = server.GetDatabase(config.GetSection("MongoDB").GetSection("Database").Value);
            _supermarketLocations = database.GetCollection<SupermarketLocation>(config.GetSection("MongoDB").GetSection("SupermarketLocationsCollectionName").Value);
            _supermarketBrandService = supermarketBrandService;
        }

        public SupermarketLocation Create(SupermarketLocation supermarketLocation) {
            if(checkDuplicate(supermarketLocation) != null) { // Make sure this object doesn't exist yet
                SupermarketBrand sm = _supermarketBrandService.Read(supermarketLocation.idSupermarketBrand);
                throw new AppException("A "+sm.name+" in \"" + supermarketLocation.location + "\" (or with the same coordinates) already exists.");
            }
            _supermarketLocations.InsertOne(supermarketLocation); // Insert object in the database
            return supermarketLocation;
        }

        public SupermarketLocation checkDuplicate(SupermarketLocation supermarketLocation) =>
            _supermarketLocations.Find<SupermarketLocation>(superLoc => superLoc.idSupermarketBrand == supermarketLocation.idSupermarketBrand && (superLoc.location == supermarketLocation.location || (superLoc.latitude == supermarketLocation.latitude && superLoc.longitude == supermarketLocation.longitude))).FirstOrDefault();
        public SupermarketLocation Read(string id) => _supermarketLocations.Find<SupermarketLocation>(supermarketLocation => supermarketLocation.id == id).FirstOrDefault(); // Get supermarket by id

        public List<SupermarketLocation> Search(string supermarketId, string search) => _supermarketLocations.Find(supermarketLocation => supermarketLocation.idSupermarketBrand.Contains(supermarketId) && supermarketLocation.location.ToLower().Contains(search.ToLower()) || supermarketLocation.longitude.ToLower().Contains(search.ToLower()) || supermarketLocation.latitude.ToLower().Contains(search.ToLower())).ToList();

        public void Update(SupermarketLocation supermarketLocation) {
            var super = Read(supermarketLocation.id);
            if(super == null)
                throw new AppException("Supermarket not found");

            // Update updatable supermarket brand fields on the object that comes from the database, because it may contain more (non-updatable) fields which we want to keep.
            super.idSupermarketBrand = supermarketLocation.idSupermarketBrand;
            super.location = supermarketLocation.location;
            super.latitude = supermarketLocation.latitude;
            super.longitude = supermarketLocation.longitude;

            _supermarketLocations.ReplaceOne(s => s.id == s.id, super); // Update supermarket brand on the database
        }
        public void Delete(string id) {
            if(Read(id) != null) { // If this supermarket brand exists in the database
                _supermarketLocations.DeleteOne(s => s.id == id); // Remove it
            }
        }
    }
}