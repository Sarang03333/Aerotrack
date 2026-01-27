using AeroTrack.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AeroTrack.Api.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

    public DbSet<Aircraft> Aircraft => Set<Aircraft>();
    public DbSet<MaintenanceTask> MaintenanceTasks => Set<MaintenanceTask>();
    public DbSet<SparePart> SpareParts => Set<SparePart>();
    public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
    public DbSet<FleetReport> FleetReports => Set<FleetReport>();

    protected override void OnModelCreating(ModelBuilder b)
    {
        base.OnModelCreating(b);
        b.Entity<Aircraft>().HasIndex(x => x.TailNumber).IsUnique();
        b.Entity<SparePart>().HasIndex(x => x.PartNumber).IsUnique();
    }
}
