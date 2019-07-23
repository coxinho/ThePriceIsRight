using MongoDB.Driver;
using Server.Models;
using System.Collections.Generic;
using System.Linq;
using Server.Helpers;
using Microsoft.Extensions.Configuration;

namespace Server.Services {
    // CRUD Interface
    public interface IProductService {
        Product Create(Product product);
        Product Read(string ean);
        List<Product> Search(string search);
        void Update(Product product);
        void Delete(string id);
    }

    public class ProductService : IProductService {
        private readonly IMongoCollection<Product> _products;

        public ProductService(IConfiguration config, IMongoDB settings) {
            var server = new MongoClient(config.GetSection("MongoDB").GetSection("ConnectionString").Value);
            var database = server.GetDatabase(config.GetSection("MongoDB").GetSection("Database").Value);
            _products = database.GetCollection<Product>(config.GetSection("MongoDB").GetSection("ProductsCollectionName").Value);
        }

        public Product Create(Product product) {
            if(Read(product.ean) != null) // Make sure this EAN doesn't exist yet
                throw new AppException("EAN \"" + product.ean + "\" is already registered.");
            _products.InsertOne(product); // Insert product in the database
            return product;
        }
        
        public Product Read(string ean) => _products.Find<Product>(product => product.ean == ean).FirstOrDefault(); // Get product by EAN

        // Obter lista de productos por pesquisa de uma string na marca, nome e EAN do producto
        public List<Product> Search(string search) => _products.Find(product => product.brand.ToLower().Contains(search.ToLower()) || product.name.ToLower().Contains(search.ToLower()) || product.ean.ToLower().Contains(search.ToLower())).ToList();

        // Actualizar producto
        public void Update(Product product) {
            // Validar id do producto
            var prod = Read(product.ean);
            if(prod == null)
                throw new AppException("Product not found");

            // Actualizar producto que vem da base de dados (em vez do producto que vem nos argumentos, porque o producto que vem da base de dados pode ter mais campos do que aqueles que vêm do cliente)
            prod.brand = product.brand;
            prod.name = product.name;
            //prod.Ean = product.Ean; // Não é possível alterar o EAN. Apenas se podem criar productos novos com um determinado EAN.

            _products.ReplaceOne(p => p.ean == product.ean, prod); // Actualizar producto na base de dados
        }
        public void Delete(string ean) {
            if(Read(ean) != null) { // Se um producto com este id existir na base dados
                _products.DeleteOne(p => p.ean == ean); // Removê-lo da base de dados
            }
        }
    }
}