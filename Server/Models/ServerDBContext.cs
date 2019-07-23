using Microsoft.EntityFrameworkCore;

namespace Server.Models {
    public class ServerDBContext : DbContext {
        public ServerDBContext(DbContextOptions<ServerDBContext> options) : base(options) {
            
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Product> Products { get; set; }
    }
}