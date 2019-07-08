﻿using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;

namespace Server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            BuildWebHost(args).Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .UseUrls("https://localhost:5001") // Podemos aceder aos ficheiros que estão em /wwwroot/ neste endereço
                .Build();
    }
}
