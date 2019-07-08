namespace Server.Dtos {
    // Esta é a classe usada para comunicar com o cliente
    public class UserDto {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public bool Admin { get; set; }
    }
}