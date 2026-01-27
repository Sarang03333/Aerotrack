using System.Security.Claims;
using AeroTrack.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace AeroTrack.Api.Data;

public static class SeedIdentity
{
    private static readonly string[] Roles = {
        "Admin", "MaintenanceEngineer", "InventoryManager", "Auditor"
    };

    public static async Task EnsureSeedAsync(IServiceProvider sp)
    {
        var roleMgr = sp.GetRequiredService<RoleManager<IdentityRole>>();
        var userMgr = sp.GetRequiredService<UserManager<ApplicationUser>>();
        var cfg     = sp.GetRequiredService<IConfiguration>();

        foreach (var r in Roles)
            if (!await roleMgr.RoleExistsAsync(r))
                await roleMgr.CreateAsync(new IdentityRole(r));

        var email = cfg["Admin:Email"] ?? "admin@aerotrack.local";
        var pass  = cfg["Admin:Password"] ?? "Admin!2345";

        var admin = await userMgr.FindByEmailAsync(email);
        if (admin is null)
        {
            admin = new ApplicationUser { UserName = email, Email = email, EmailConfirmed = true };
            await userMgr.CreateAsync(admin, pass);
            await userMgr.AddToRoleAsync(admin, "Admin");
            await userMgr.AddClaimsAsync(admin, new[] { new Claim("scope","api") });
        }
    }
}