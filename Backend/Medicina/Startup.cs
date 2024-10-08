namespace Medicina
{
    using Medicina.Context;
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.EntityFrameworkCore;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Options;
    using Microsoft.IdentityModel.Tokens;
    using System.Text;
    using System;
    using Microsoft.AspNetCore.Identity;
    using Medicina.MailUtil;
    using Microsoft.OpenApi.Models;
    using Medicina.Services;
    using Medicina.Service;

    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }


        public void ConfigureServices(IServiceCollection services)
        {
            services.AddTransient<ICoordinateGeneratorService, CoordinateGeneratorService>();
            services.AddSingleton<RabbitMQService>();
            services.AddCors(options =>
            {
                options.AddPolicy(name: "AllowOrigin", builder =>
                {
                    builder.WithOrigins("http://localhost:4200").AllowAnyHeader().AllowAnyMethod();
                });

            });

            services.AddControllers()
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.Converters.Add(new TimeSpanToStringConverter());
                });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "Medicina",
                    Version = "v1",
                    Description = "Your API Description",
                    // Additional information (optional)
                    // Contact = new OpenApiContact
                    // {
                    //     Name = "Your Name",
                    //     Email = "Your Email",
                    //     Url = new Uri("Your Website URL")
                    // },
                    // License = new OpenApiLicense
                    // {
                    //     Name = "Your License",
                    //     Url = new Uri("Your License URL")
                    // }
                });
            });

        services.AddControllers();
            services.Configure<MailSettings>(Configuration.GetSection("MailSettings"));
            services.AddTransient<IMailService, MailService>();
            services.AddDbContext<UserContext>(options => options.UseSqlServer(Configuration.GetConnectionString("MyDBConnection")));
            services.AddDbContext<PersonContext>(options => options.UseSqlServer(Configuration.GetConnectionString("MyDBConnection")));
            services.AddDbContext<EquipmentContext>(options => options.UseSqlServer(Configuration.GetConnectionString("MyDBConnection")));
            services.AddDbContext<CompanyContext>(options => options.UseSqlServer(Configuration.GetConnectionString("MyDBConnection")));
            services.AddDbContext<CompanyRateContext>(options => options.UseSqlServer(Configuration.GetConnectionString("MyDBConnection")));
            services.AddDbContext<AppointmentContext>(options => options.UseSqlServer(Configuration.GetConnectionString("MyDBConnection")));
            services.AddDbContext<ReservationContext>(options => options.UseSqlServer(Configuration.GetConnectionString("MyDBConnection")));
            services.AddDbContext<EquipmentTrackingContext>(options => options.UseSqlServer(Configuration.GetConnectionString("MyDBConnection")));
            services.AddDbContext<PickupReservationContext>(options => options.UseSqlServer(Configuration.GetConnectionString("MyDBConnection")));
            services.AddTransient<QRCodeService>(); // Add this line
            services.AddTransient<EmailService>(); // Add this line

        }




        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors("AllowOrigin");  // Place this before app.UseAuthorization();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "Your API Title V1");
                // Specify the Swagger UI route (optional)
                // c.RoutePrefix = "swagger";
            });
        }

    }

}
