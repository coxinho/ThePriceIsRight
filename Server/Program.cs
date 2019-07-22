using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Server {
    public class Program {
        public static void Main(string[] args) {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args) // Static Method that creates the web host
                .UseStartup<Startup>()
                .UseUrls("https://localhost:5001") // We can access files at /wwwroot/
                .Build();
    }
}
