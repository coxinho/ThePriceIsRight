namespace Server.Dtos {
    // Class used to communicate with the client (passwordHash and passwordSalt have been removed)
    public class UserDto {
        public string id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string username { get; set; }
        public string password { get; set; }
        public bool admin { get; set; }
    }
}