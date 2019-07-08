using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Server.Helpers;
using Server.Services;
using Microsoft.Extensions.Options;

namespace Server {
    public class Startup {
        public Startup(IConfiguration configuration) {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services) {
            // Adicionar uma política de Cross-Origin Resource Sharing (CORS) que permite a um cliente aceder ao servidor de outros IPs e portas.
            // Criei esta política para poder aceder a https://localhost:5001 (versão de produção) de https://localhost:8080 (versão de desenvolvimento)
            services.AddCors(o => o.AddPolicy("AllowCORS", builder => {
                builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            }));

            // Obter a secção "MongoDB" do ficheiro appsettings.json
            services.Configure<MongoDB>(
                Configuration.GetSection(nameof(MongoDB))
            );
            services.AddSingleton<IMongoDB>(sp =>
                sp.GetRequiredService<IOptions<MongoDB>>().Value
            );
            services.AddSingleton<MongoDB>();

            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddAutoMapper();

            // Criar uma Claim chamada "AdminClaim" que garante que "Admin" é "true", para validar se um utilizador é Administrador.
            services.AddAuthorization(options => {  
                options.AddPolicy("AdminClaim", policy => policy.RequireClaim("Admin", "true"));  
            });
            
            // Configure strongly typed settings objects
            var appAuthentication = Configuration.GetSection("Authentication");
            services.Configure<AppSettings>(appAuthentication);

            // Configure jwt authentication
            var appSettings = appAuthentication.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes("thisisaverylongandawesomepassword" /*appSettings.Secret*/);
            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.Events = new JwtBearerEvents
                {
                    OnTokenValidated = context =>
                    {
                        var userService = context.HttpContext.RequestServices.GetRequiredService<IUserServiceMongo>();
                        var userId = context.Principal.Identity.Name;
                        var user = userService.GetById(userId);
                        if (user == null)
                            context.Fail("Unauthorized"); // return unauthorized if user no longer exists
                        return Task.CompletedTask;
                    }
                };
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

            // Configure Dependency Injection (DI) for application services
            services.AddScoped<IUserServiceMongo, UserServiceMongo>();
            services.AddScoped<IProductServiceMongo, ProductServiceMongo>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env) {
            if (env.IsDevelopment())
                app.UseDeveloperExceptionPage();
            else
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            
            app.UseCors("AllowCORS"); // Esta política permite acesso de qualquer origem. Remover esta linha em produção.
            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseAuthentication();
            app.UseHttpsRedirection();
            app.UseMvc();
        }
    }
}
