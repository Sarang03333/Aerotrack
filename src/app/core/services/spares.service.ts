import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { SparePart } from "../../core/models/spare-part.model";
import { HttpClient } from "@angular/common/http";

const STORAGE_KEY = "aerotrack.spares";

@Injectable({ providedIn: "root" })
export class SparesService {
  private readonly _parts$ = new BehaviorSubject<SparePart[]>([]);
  constructor(private http: HttpClient) {
    this.initialize();
  }

  private initialize() {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        this._parts$.next(JSON.parse(cached));
        return;
      } catch {}
    }
    this.http.get<SparePart[]>("assets/mock/spares.json").subscribe({
      next: (d) => {
        this._parts$.next(d);
        this.persist();
      },
      error: () => {
        const fallback: SparePart[] = [
          {
            partID: "SP-9001",
            name: "Hydraulic Pump",
            quantityAvailable: 2,
            reorderLevel: 5,
            lastUpdated: new Date().toISOString().slice(0, 10),
          },
        ];
        this._parts$.next(fallback);
        this.persist();
      },
    });
  }

  list(): Observable<SparePart[]> {
    return this._parts$.asObservable();
  }
  getValue(): SparePart[] {
    return this._parts$.getValue();
  }
  getById(id: string) {
    return this.getValue().find((p) => p.partID === id);
  }

  add(part: SparePart) {
    const arr = this.getValue();
    if (arr.some((p) => p.partID === part.partID))
      throw new Error("PartID must be unique");
    this._parts$.next([...arr, part]);
    this.persist();
  }
  update(id: string, changes: Partial<SparePart>) {
    this._parts$.next(
      this.getValue().map((p) => (p.partID === id ? { ...p, ...changes } : p))
    );
    this.persist();
  }
  remove(id: string) {
    this._parts$.next(this.getValue().filter((p) => p.partID !== id));
    this.persist();
  }

  isLowStock(p: SparePart) {
    return p.quantityAvailable <= p.reorderLevel;
  }

  replenish(id: string) {
    // Mock vendor integration: simply set quantity to reorderLevel + 5 and update date
    const updated = this.getValue().map((p) => {
      if (p.partID === id) {
        return {
          ...p,
          quantityAvailable: Math.max(p.reorderLevel + 5, p.quantityAvailable),
          lastUpdated: new Date().toISOString().slice(0, 10),
        };
      }
      return p;
    });
    this._parts$.next(updated);
    this.persist();
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.getValue()));
  }
}
