using MongoDB.Driver;
using Server.Entities;
using System.Collections.Generic;
using System.Linq;
using Server.Helpers;
using System;

namespace Server.Services
{
    public class UserServiceMongo
    {
        private readonly IMongoCollection<User> _users;

        public UserServiceMongo(IMongoDB settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.Database);

            _users = database.GetCollection<User>(settings.UsersCollectionName);
        }

        public List<User> Get() =>
            _users.Find(user => true).ToList();

        public User Get(int id) =>
            _users.Find<User>(user => user.Id == id).FirstOrDefault();

        public User Create(User user)
        {
            _users.InsertOne(user);
            return user;
        }

        public void Update(User userIn, string password = null) {
            var user = Get(userIn.Id);

            if(user == null)
                throw new AppException("User not found");

            if (userIn.Username != user.Username) {
                // username has changed so check if the new username is already taken
                if (_users.Find<User>(u => u.Username == userIn.Username).FirstOrDefault() != null)
                    throw new AppException("Username " + userIn.Username + " is already taken");
            }

            // update user properties
            user.FirstName = userIn.FirstName;
            user.LastName = userIn.LastName;
            user.Username = userIn.Username;

            // update password if it was entered
            if (!string.IsNullOrWhiteSpace(password))
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash(password, out passwordHash, out passwordSalt);
                string passwordHashString = Convert.ToBase64String(passwordHash);
                string passwordSaltString = Convert.ToBase64String(passwordSalt);

                user.PasswordHash = passwordHashString;
                user.PasswordSalt = passwordSaltString;
            }

            _users.ReplaceOne(u => u.Id == user.Id, user);
        }

        public void Delete(int id) => 
            _users.DeleteOne(user => user.Id == id);

            // private helper methods

        public static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");

            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            if (password == null) throw new ArgumentNullException("password");
            if (string.IsNullOrWhiteSpace(password)) throw new ArgumentException("Value cannot be empty or whitespace only string.", "password");
            if (storedHash.Length != 64) throw new ArgumentException("Invalid length of password hash (64 bytes expected).", "passwordHash");
            if (storedSalt.Length != 128) throw new ArgumentException("Invalid length of password salt (128 bytes expected).", "passwordHash");

            using (var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < computedHash.Length; i++)
                {
                    if (computedHash[i] != storedHash[i]) return false;
                }
            }

            return true;
        }
    }
}