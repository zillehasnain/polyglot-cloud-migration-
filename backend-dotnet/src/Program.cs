var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(o => o.AddPolicy("AllowAll", b => b.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));
var app = builder.Build();
app.UseCors("AllowAll");

// Initial Patient Data
var patients = new List<Patient> {
    new Patient(1, "Sara Khan", "ICU - Bay 1", 72, 98, "STABLE"),
    new Patient(2, "Zubair Ahmed", "ICU - Bay 4", 85, 96, "STABLE"),
    new Patient(3, "Esha Fatima", "ICU - Bay 2", 115, 91, "STABLE"), // Will trigger AI
    new Patient(4, "Omar Farooq", "ICU - Bay 5", 68, 99, "STABLE"),
    new Patient(5, "Amina Bibi", "ICU - Bay 3", 125, 89, "STABLE"),  // Will trigger AI
    new Patient(6, "Hamza Ali", "ICU - Bay 6", 75, 97, "STABLE")
};
app.MapGet("/api/patients", () => {
    // Simulate real-time vitals fluctuation
    var rng = new Random();
    foreach(var p in patients) {
        p.HeartRate += rng.Next(-2, 3); // Fluctuate BPM
        if (p.HeartRate < 60) p.HeartRate = 65; // Floor
    }
    return Results.Ok(patients);
});

app.MapPost("/api/patients/{id}/status", (int id, StatusUpdate update) => {
    var p = patients.FirstOrDefault(x => x.Id == id);
    if (p != null) { p.Status = update.Status; return Results.Ok(); }
    return Results.NotFound();
});

app.Run("http://0.0.0.0:5000");

public class Patient {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Room { get; set; }
    public int HeartRate { get; set; }
    public int SpO2 { get; set; }
    public string Status { get; set; }
    public Patient(int i, string n, string r, int h, int s, string st) {
        Id=i; Name=n; Room=r; HeartRate=h; SpO2=s; Status=st;
    }
}
public record StatusUpdate(string Status);