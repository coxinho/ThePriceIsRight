using MongoDB.Driver;
using Server.Entities;
using System.Collections.Generic;
using System.Linq;
using Server.Helpers;

namespace Server.Services {
    // Interface do serviço ProductService
    public interface IProductServiceMongo {
        Product Create(Product product);
        Product GetProduct(string ean);
        List<Product> GetProducts(string search);
        void Update(Product product);
        void Delete(string id);
    }

    public class ProductServiceMongo : IProductServiceMongo {
        private readonly IMongoCollection<Product> _products;

        public ProductServiceMongo(IMongoDB settings) {
            var server = new MongoClient("mongodb://localhost:27017");
            var database = server.GetDatabase("ThePriceIsRightDatabase");
            _products = database.GetCollection<Product>("products"); // Coleção à qual podemos fazer pedidos de dados
        }

        public Product Create(Product product) {
            // Validar EAN
            if (_products.Find<Product>(u => u.Ean == product.Ean).FirstOrDefault() != null)
                throw new AppException("EAN \"" + product.Ean + "\" is already registered.");
            
            _products.InsertOne(product); // Inserir producto na base de dados
            return product;
        }
        public Product GetProduct(string id) => _products.Find<Product>(product => product.Id == id).FirstOrDefault(); // Obter producto por id

        // Obter lista de productos por pesquisa de uma string na marca, nome e EAN do producto
        public List<Product> GetProducts(string search) => _products.Find(product => product.Brand.ToLower().Contains(search.ToLower()) || product.Name.ToLower().Contains(search.ToLower()) || product.Ean.ToLower().Contains(search.ToLower())).ToList();

        // Actualizar producto
        public void Update(Product product) {
            // Validar id do producto
            var prod = GetProduct(product.Id);
            if(prod == null)
                throw new AppException("Product not found");

            // Actualizar producto que vem da base de dados (em vez do producto que vem nos argumentos, porque o producto que vem da base de dados pode ter mais campos do que aqueles que vêm do cliente)
            prod.Brand = product.Brand;
            prod.Name = product.Name;
            //prod.Ean = product.Ean; // Não é possível alterar o EAN. Apenas se podem criar productos novos com um determinado EAN.
            prod.Continente = product.Continente;
            prod.Dia = product.Dia;
            prod.Intermarche = product.Intermarche;
            prod.Jumbo = product.Jumbo;
            prod.Lidl = product.Lidl;
            prod.PingoDoce = product.PingoDoce;

            _products.ReplaceOne(p => p.Id == product.Id, prod); // Actualizar producto na base de dados
        }
        public void Delete(string id) {
            if(GetProduct(id) != null) { // Se um producto com este id existir na base dados
                _products.DeleteOne(p => p.Id == id); // Removê-lo da base de dados
            }
        }
    }
}