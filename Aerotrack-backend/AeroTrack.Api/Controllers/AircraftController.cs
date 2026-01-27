using AeroTrack.Api.Data;
using AeroTrack.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AeroTrack.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,MaintenanceEngineer")]
public class AircraftController : ControllerBase
{
    private readonly AppDbContext _db;
    public AircraftController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IEnumerable<Aircraft>> Get() =>
        await _db.Aircraft.AsNoTracking().ToListAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Aircraft>> Get(Guid id)
    {
        var a = await _db.Aircraft.FindAsync(id);
        return a is null ? NotFound() : a;
    }

    [HttpPost]
    public async Task<ActionResult<Aircraft>> Create([FromBody] Aircraft model)
    {
        _db.Aircraft.Add(model);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = model.Id }, model);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] Aircraft model)
    {
        if (id != model.Id) return BadRequest();
        _db.Entry(model).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var a = await _db.Aircraft.FindAsync(id);
        if (a is null) return NotFound();
        _db.Aircraft.Remove(a);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}