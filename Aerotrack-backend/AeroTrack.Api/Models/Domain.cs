using System;

namespace AeroTrack.Api.Models;

public class Aircraft {
    public Guid Id { get; set; } = Guid.NewGuid();
    public string TailNumber { get; set; } = default!;   // e.g., AA-0001
    public string Model { get; set; } = default!;
    public string? ServiceHistory { get; set; }
    public string? ComplianceStatus { get; set; }
}

public class MaintenanceTask {
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AircraftId { get; set; }
    public Aircraft Aircraft { get; set; } = default!;
    public DateTime ScheduledDate { get; set; }
    public string Status { get; set; } = "PENDING";      // PENDING, IN_PROGRESS, COMPLETED
    public string? Notes { get; set; }
}

public class SparePart {
    public Guid Id { get; set; } = Guid.NewGuid();
    public string PartNumber { get; set; } = default!;
    public string Name { get; set; } = default!;
    public int QuantityAvailable { get; set; }
    public int ReorderLevel { get; set; }
    public DateTime LastUpdated { get; set; } = DateTime.UtcNow;
}

public class AuditLog {
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid AircraftId { get; set; }
    public Aircraft Aircraft { get; set; } = default!;
    public string Findings { get; set; } = default!;
    public DateTime Date { get; set; } = DateTime.UtcNow;
}

public class FleetReport {
    public Guid Id { get; set; } = Guid.NewGuid();
    public string MetricsJson { get; set; } = "{}";
    public DateTime GeneratedDate { get; set; } = DateTime.UtcNow;
}
