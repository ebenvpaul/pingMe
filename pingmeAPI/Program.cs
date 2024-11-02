using pingmeAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.Configure<MongoDBSettings>(builder.Configuration.GetSection("MongoDBSettings"));
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<DatabaseService>();
builder.Services.AddControllers();
var app = builder.Build();
app.UseCors(x => x.AllowAnyHeader().AllowAnyMethod().AllowCredentials()
    .WithOrigins("http://localhost:4200", "https://localhost:4200"));
// Seed sample data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var userService = services.GetRequiredService<UserService>();
    var DBService = services.GetRequiredService<DatabaseService>();
    bool worked=DBService.PingDB();
     if (!worked)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError("Database connection failed.");
    }
    else
    {
     await userService.SeedSampleUsersAsync();
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();

