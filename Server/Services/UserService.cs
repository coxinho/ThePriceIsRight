using MongoDB.Driver;
using Server.Models;
using System.Collections.Generic;
using System.Linq;
using Server.Helpers;
using System;
using Microsoft.Extensions.Configuration;

namespace Server.Services {

    // Definir interface de comunicação com a classe UserServiceMongo
    public interface IUserService {
        User Register(User user, string password);
        User Login(string username, string password);
        List<User> GetAll();
        User GetById(string id);
        void Update(User user, string password = null);
        void Delete(string id);
    }


    public class UserService : IUserService {
        private readonly IMongoCollection<User> _users; // _users é uma colecção com interface IMongoCollection do tipo classe User

        public UserService(IConfiguration config, IMongoDB settings) {
            var server = new MongoClient(config.GetSection("MongoDB").GetSection("ConnectionString").Value);
            var database = server.GetDatabase(config.GetSection("MongoDB").GetSection("Database").Value);
            _users = database.GetCollection<User>(config.GetSection("MongoDB").GetSection("UsersCollectionName").Value);
        }

        public User Register(User user, string password) {
            // Validate password
            if (string.IsNullOrWhiteSpace(password))
                throw new AppException("Password is required");

            // Validate username
            if (_users.Find<User>(u => u.username == user.username).FirstOrDefault() != null)
                throw new AppException("Username \"" + user.username + "\" is already taken!");

            // Create password hash and salt
            byte[] passwordHash, passwordSalt;
            CreatePasswordHash(password, out passwordHash, out passwordSalt);
            string passwordHashString = Convert.ToBase64String(passwordHash);
            string passwordSaltString = Convert.ToBase64String(passwordSalt);

            // Save hash and salt on the user object
            user.passwordHash = passwordHashString;
            user.passwordSalt = passwordSaltString;
            user.admin = false; // By default, new users don't have admin privileges
            
            _users.InsertOne(user); // Insert user in the database
            return user;
        }

        public User Login(string username, string password) {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password)) // Se o username ou a password estiverem vazios, retornar null
                return null;

            var user = _users.Find<User>(u => u.username == username).FirstOrDefault(); // Procurar por este username na base de dados

            // Verificar se este utilizador existe
            if (user == null)
                return null;

            // Verificar se a password está correcta
            byte[] passwordHashBytes = Convert.FromBase64String(user.passwordHash);
            byte[] passwordSaltBytes = Convert.FromBase64String(user.passwordSalt);
            if (!VerifyPasswordHash(password, passwordHashBytes, passwordSaltBytes))
                return null;

            // Se tudo tiver corrido bem, a autênticação foi feita com sucesso!
            return user;
        }

        public List<User> GetAll() => _users.Find(user => true).ToList(); // Obtain all users

        public User GetById(string id) => _users.Find<User>(user => user.id == id).FirstOrDefault(); // Obter o utilizador com o id que vem no argumento

        public void Update(User userIn, string password = null) {
            // Validar utilizador
            var user = GetById(userIn.id);
            if(user == null)
                throw new AppException("User not found");

            // Validar username
            if (userIn.username != user.username) {
                // username has changed so check if the new username is already taken
                if (_users.Find<User>(u => u.username == userIn.username).FirstOrDefault() != null)
                    throw new AppException("Username " + userIn.username + " is already taken!");
            }

            // Actualizar propriedades do utilizador
            user.firstName = userIn.firstName;
            user.lastName = userIn.lastName;
            user.username = userIn.username;

            // Actualizar password se tiver sido escrita
            if (!string.IsNullOrWhiteSpace(password)) {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);
                string passwordHashString = Convert.ToBase64String(passwordHash);
                string passwordSaltString = Convert.ToBase64String(passwordSalt);

                user.passwordHash = passwordHashString;
                user.passwordSalt = passwordSaltString;
            }

            // Actualizar utilizador na base de dados
            _users.ReplaceOne(u => u.id == user.id, user);
        }

        public void Delete(string id) {
            if(GetById(id) != null) { // Se este id existir na base de dados
                _users.DeleteOne(user => user.id == id); // Removê-lo
            }
        }

        // Métodos auxiliares privados
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