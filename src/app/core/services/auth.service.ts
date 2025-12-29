import { Injectable, inject } from "@angular/core";
import { Router } from "@angular/router";
import { User, Role } from "../models/user.model";

@Injectable({ providedIn: "root" })
export class AuthService {
  private readonly LS_KEY = "aerotrack.currentUser";
  private router = inject(Router);

  // DEMO USERS (do not use in production)
  private readonly demoUsers: Array<User & { password: string }> = [
    {
      id: "u-admin-1",
      username: "admin",
      password: "admin123",
      displayName: "Admin User",
      role: "admin",
    },
    {
      id: "u-sup-1",
      username: "supervisor",
      password: "sup123",
      displayName: "Supervisor User",
      role: "supervisor",
    },
    {
      id: "u-tech-1",
      username: "technician",
      password: "tech123",
      displayName: "Technician User",
      role: "technician",
    },
  ];

  private currentUser: User | null = null;
  redirectUrl: string | null = null;

  constructor() {
    const raw = localStorage.getItem(this.LS_KEY);
    if (raw) {
      try {
        this.currentUser = JSON.parse(raw) as User;
      } catch {
        /* ignore */
      }
    }
  }

  get user(): User | null {
    return this.currentUser;
  }
  get role(): Role | null {
    return this.currentUser?.role ?? null;
  }
  get isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  login(username: string, password: string): boolean {
    const found = this.demoUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (!found) return false;

    const { password: _, ...safeUser } = found;
    this.currentUser = safeUser;
    localStorage.setItem(this.LS_KEY, JSON.stringify(safeUser));

    const target = this.redirectUrl ?? "/aircraft"; // default landing after login
    this.redirectUrl = null;
    this.router.navigateByUrl(target);
    return true;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem(this.LS_KEY);
    this.router.navigate(["/login"]);
  }
}
