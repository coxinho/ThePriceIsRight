using MongoDB.Driver;
using Server.Entities;
using System.Collections.Generic;
using System.Linq;
using Server.Helpers;
using System;

namespace Server.Services {

    // Definir interface de comunicação com a classe UserServiceMongo
    public interface IUserServiceMongo {
        User Authenticate(string username, string password);
        List<User> GetAll();
        User GetById(string id);
        User Create(User user, string password);
        void Update(User user, string password = null);
        void Delete(string id);
    }

    public class UserServiceMongo : IUserServiceMongo {
        private readonly IMongoCollection<User> _users; // _users é uma colecção com interface IMongoCollection do tipo classe User

        public UserServiceMongo(IMongoDB settings) {
            var client = new MongoClient("mongodb://localhost:27017"/*settings.ConnectionString */); // Ligamo-nos ao servidor
            var database = client.GetDatabase("ThePriceIsRightDatabase"/*settings.Database*/); // Peço para usar a base de dados "ThePriceIsRightDatabase"
            _users = database.GetCollection<User>("users"/*settings.UsersCollectionName */); // Peço para aceder à coleção "users"
        }

        public User Authenticate(string username, string password) {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password)) // Se o username ou a password estiverem vazios, retornar null
                return null;

            var user = _users.Find<User>(u => u.Username == username).FirstOrDefault(); // Procurar por este username na base de dados

            // Verificar se este utilizador existe
            if (user == null)
                return null;

            // Verificar se a password está correcta
            byte[] passwordHashBytes = Convert.FromBase64String(user.PasswordHash);
            byte[] passwordSaltBytes = Convert.FromBase64String(user.PasswordSalt);
            if (!VerifyPasswordHash(password, passwordHashBytes, passwordSaltBytes))
                return null;

            // Se tudo tiver corrido bem, a autênticação foi feita com sucesso!
            return user;
        }

        public List<User> GetAll() => _users.Find(user => true).ToList(); // Obter todos os utilizadores registados

        public User GetById(string id) => _users.Find<User>(user => user.Id == id).FirstOrDefault(); // Obter o utilizador com o id que vem no argumento

        public User Create(User user, string password) {
            // Validar password
            if (string.IsNullOrWhiteSpace(password))
                throw new AppException("Password is required");

            // Validar username
            if (_users.Find<User>(u => u.Username == user.Username).FirstOrDefault() != null)
                throw new AppException("Username \"" + user.Username + "\" is already taken!");

            // Criar hash e salt da password
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);
            string passwordHashString = Convert.ToBase64String(passwordHash);
            string passwordSaltString = Convert.ToBase64String(passwordSalt);

            // Escrever hash e salt da password no objecto user
            user.PasswordHash = passwordHashString;
            user.PasswordSalt = passwordSaltString;
            user.Admin = false; // Por omissão, os utilizadores não são administradores
            
            // Inserir utilizador na base de dados
            _users.InsertOne(user);
            return user;
        }

        public void Update(User userIn, string password = null) {
            // Validar utilizador
            var user = GetById(userIn.Id);
            if(user == null)
                throw new AppException("User not found");

            // Validar username
            if (userIn.Username != user.Username) {
                // username has changed so check if the new username is already taken
                if (_users.Find<User>(u => u.Username == userIn.Username).FirstOrDefault() != null)
                    throw new AppException("Username " + userIn.Username + " is already taken!");
            }

            // Actualizar propriedades do utilizador
            user.FirstName = userIn.FirstName;
            user.LastName = userIn.LastName;
            user.Username = userIn.Username;

            // Actualizar password se tiver sido escrita
            if (!string.IsNullOrWhiteSpace(password)) {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);
                string passwordHashString = Convert.ToBase64String(passwordHash);
                string passwordSaltString = Convert.ToBase64String(passwordSalt);

                user.PasswordHash = passwordHashString;
                user.PasswordSalt = passwordSaltString;
            }

            // Actualizar utilizador na base de dados
            _users.ReplaceOne(u => u.Id == user.Id, user);
        }

        public void Delete(string id) {
            if(GetById(id) != null) { // Se este id existir na base de dados
                _users.DeleteOne(user => user.Id == id); // Removê-lo
            }
        }

        // Métodos ajudantes privados
        private static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt) {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512()) {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt) {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt)) {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                    if (computedHash[i] != storedHash[i])
                        return false;
            }

            return true;
        }
    }
}