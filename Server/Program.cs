using Microsoft.AspNetCore; // Um namespace é um conjunto de classes :)
using Microsoft.AspNetCore.Hosting;

namespace Server {
	public class Program {
		public static void Main(string[] args) {
			Build(args).Run();
		}

		public static IWebHost Build(string[] args)
			=> WebHost.CreateDefaultBuilder(args).UseStartup<Startup>().UseUrls("https://localhost:5001").Build();
	}
}
