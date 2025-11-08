/**
 * Admin API Service Layer
 * Handles all backend API calls for admin dashboard
 */

import { getCollection, upsertById, patchById, addRow, getDocByPath, listenCollection } from "@shared/lib/db";
import type { UserProfile, UserRole, Entity, SubEntry } from "@shared/types/entities";

// ============================================================================
// Types
// ============================================================================

export interface AdminUser extends UserProfile {
  entityName?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminEntity extends Entity {
  totalUsers: number;
  totalPatients: number;
  status: "active" | "inactive" | "maintenance";
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity?: string;
  entityId?: string;
  timestamp: string;
  type: "create" | "update" | "delete" | "security" | "transaction";
  details?: Record<string, unknown>;
}

export interface Alert {
  id: string;
  type: "critical" | "warning" | "info";
  entity: string;
  entityId: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: string;
}

export interface Report {
  id: string;
  name: string;
  type: "analytics" | "financial" | "inventory" | "performance";
  generatedAt: string;
  generatedBy: string;
  format: "PDF" | "CSV" | "Excel";
  size: string;
  url?: string;
}

export interface AnalyticsData {
  totalPatients: number;
  totalConsultations: number;
  totalPrescriptions: number;
  activeEntities: number;
  consultationTime: number;
  patientSatisfaction: number;
  waitTime: number;
  completionRate: number;
  patientFlow: Array<{ month: string; registered: number; consultations: number; followups: number }>;
  departmentData: Array<{ department: string; patients: number }>;
}

export interface Settings {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  security: {
    twoFactor: boolean;
    autoLogout: boolean;
    sessionTimeout: number;
  };
  regional: {
    language: string;
    timezone: string;
  };
  appearance: {
    darkMode: boolean;
    compactView: boolean;
  };
  clinic: {
    name: string;
    address: string;
    phone: string;
    email: string;
    hours: string;
    branding?: {
      logo?: string;
      primaryColor?: string;
    };
  };
  features: {
    [key: string]: boolean;
  };
}

// ============================================================================
// User Management API
// ============================================================================

/**
 * Fetch all users with optional filters
 */
export async function fetchUsers(params?: {
  role?: UserRole;
  entityId?: string;
  status?: "active" | "inactive";
  search?: string;
}): Promise<AdminUser[]> {
  try {
    // In production, this would call: GET /api/admin/users?role=...&entityId=...
    // For now, using Firestore directly
    const users = await getCollection<AdminUser>("users");
    
    let filtered = users;
    
    if (params?.role) {
      filtered = filtered.filter(u => u.roles.includes(params.role!));
    }
    
    if (params?.entityId) {
      filtered = filtered.filter(u => u.entityId === params.entityId);
    }
    
    if (params?.status) {
      // Would need status field in UserProfile
      // filtered = filtered.filter(u => u.status === params.status);
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(u => 
        u.name.toLowerCase().includes(searchLower) ||
        u.email.toLowerCase().includes(searchLower)
      );
    }
    
    return filtered;
  } catch (error) {
    console.error("[AdminAPI] Error fetching users:", error);
    throw error;
  }
}

/**
 * Create a new user
 */
export async function createUser(data: {
  name: string;
  email: string;
  roles: UserRole[];
  entityId?: string;
  subEntryId?: string;
  primaryRole?: UserRole;
  doctorSpecialization?: string;
  doctorExperienceYears?: number;
}): Promise<AdminUser> {
  try {
    // In production: POST /api/admin/users
    const newUser: Partial<AdminUser> = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    await addRow("users", newUser);
    
    return newUser as AdminUser;
  } catch (error) {
    console.error("[AdminAPI] Error creating user:", error);
    throw error;
  }
}

/**
 * Update user details
 */
export async function updateUser(userId: string, data: Partial<AdminUser>): Promise<void> {
  try {
    // In production: PATCH /api/admin/users/:id
    await patchById("users", userId, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AdminAPI] Error updating user:", error);
    throw error;
  }
}

/**
 * Delete/deactivate user
 */
export async function deleteUser(userId: string): Promise<void> {
  try {
    // In production: DELETE /api/admin/users/:id
    // For now, just mark as inactive
    await patchById("users", userId, {
      // status: "inactive", // Would need status field
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AdminAPI] Error deleting user:", error);
    throw error;
  }
}

// ============================================================================
// Entity Management API
// ============================================================================

/**
 * Fetch all entities
 */
export async function fetchEntities(type?: "hospital" | "clinic" | "pharmacy" | "lab"): Promise<AdminEntity[]> {
  try {
    const entities = await getCollection<AdminEntity>("entities");
    
    if (type) {
      return entities.filter(e => e.type === type);
    }
    
    return entities;
  } catch (error) {
    console.error("[AdminAPI] Error fetching entities:", error);
    throw error;
  }
}

/**
 * Create new entity
 */
export async function createEntity(data: Partial<AdminEntity>): Promise<AdminEntity> {
  try {
    const newEntity: Partial<AdminEntity> = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "active",
    };
    
    await addRow("entities", newEntity);
    
    return newEntity as AdminEntity;
  } catch (error) {
    console.error("[AdminAPI] Error creating entity:", error);
    throw error;
  }
}

/**
 * Update entity
 */
export async function updateEntity(entityId: string, data: Partial<AdminEntity>): Promise<void> {
  try {
    await patchById("entities", entityId, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AdminAPI] Error updating entity:", error);
    throw error;
  }
}

/**
 * Delete entity
 */
export async function deleteEntity(entityId: string): Promise<void> {
  try {
    await patchById("entities", entityId, {
      status: "inactive",
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AdminAPI] Error deleting entity:", error);
    throw error;
  }
}

// ============================================================================
// Analytics API
// ============================================================================

/**
 * Fetch analytics data
 */
export async function fetchAnalytics(params?: {
  startDate?: string;
  endDate?: string;
  entityId?: string;
}): Promise<AnalyticsData> {
  try {
    // In production: GET /api/admin/analytics?startDate=...&endDate=...
    // For now, return mock data structure
    // TODO: Implement actual analytics aggregation from Firestore
    
    return {
      totalPatients: 48524,
      totalConsultations: 1284,
      totalPrescriptions: 3210,
      activeEntities: 312,
      consultationTime: 24,
      patientSatisfaction: 4.6,
      waitTime: 18,
      completionRate: 94,
      patientFlow: [],
      departmentData: [],
    };
  } catch (error) {
    console.error("[AdminAPI] Error fetching analytics:", error);
    throw error;
  }
}

// ============================================================================
// Audit Logs API
// ============================================================================

/**
 * Fetch audit logs
 */
export async function fetchAuditLogs(params?: {
  userId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
}): Promise<AuditLog[]> {
  try {
    // In production: GET /api/admin/audit?userId=...&action=...
    const logs = await getCollection<AuditLog>("auditLogs");
    
    let filtered = logs;
    
    if (params?.userId) {
      filtered = filtered.filter(l => l.userId === params.userId);
    }
    
    if (params?.action) {
      filtered = filtered.filter(l => l.action.toLowerCase().includes(params.action!.toLowerCase()));
    }
    
    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(l => 
        l.userName.toLowerCase().includes(searchLower) ||
        l.action.toLowerCase().includes(searchLower) ||
        l.entity?.toLowerCase().includes(searchLower)
      );
    }
    
    // Sort by timestamp descending
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return filtered;
  } catch (error) {
    console.error("[AdminAPI] Error fetching audit logs:", error);
    throw error;
  }
}

/**
 * Log an audit event
 */
export async function logAuditEvent(log: Omit<AuditLog, "id" | "timestamp">): Promise<void> {
  try {
    await addRow("auditLogs", {
      ...log,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AdminAPI] Error logging audit event:", error);
    // Don't throw - audit logging should not break the main flow
  }
}

// ============================================================================
// Alerts API
// ============================================================================

/**
 * Fetch alerts
 */
export async function fetchAlerts(params?: {
  type?: "critical" | "warning" | "info";
  entityId?: string;
  acknowledged?: boolean;
}): Promise<Alert[]> {
  try {
    const alerts = await getCollection<Alert>("alerts");
    
    let filtered = alerts;
    
    if (params?.type) {
      filtered = filtered.filter(a => a.type === params.type);
    }
    
    if (params?.entityId) {
      filtered = filtered.filter(a => a.entityId === params.entityId);
    }
    
    if (params?.acknowledged !== undefined) {
      filtered = filtered.filter(a => a.acknowledged === params.acknowledged);
    }
    
    // Sort by timestamp descending
    filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return filtered;
  } catch (error) {
    console.error("[AdminAPI] Error fetching alerts:", error);
    throw error;
  }
}

/**
 * Acknowledge alert
 */
export async function acknowledgeAlert(alertId: string, userId: string): Promise<void> {
  try {
    await patchById("alerts", alertId, {
      acknowledged: true,
      acknowledgedBy: userId,
      acknowledgedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AdminAPI] Error acknowledging alert:", error);
    throw error;
  }
}

// ============================================================================
// Reports API
// ============================================================================

/**
 * Fetch reports
 */
export async function fetchReports(): Promise<Report[]> {
  try {
    const reports = await getCollection<Report>("reports");
    reports.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
    return reports;
  } catch (error) {
    console.error("[AdminAPI] Error fetching reports:", error);
    throw error;
  }
}

/**
 * Generate report
 */
export async function generateReport(data: {
  name: string;
  type: Report["type"];
  format: Report["format"];
  parameters: Record<string, unknown>;
}): Promise<Report> {
  try {
    // In production: POST /api/admin/reports/generate
    const report: Partial<Report> = {
      ...data,
      generatedAt: new Date().toISOString(),
      generatedBy: "current-user-id", // TODO: Get from auth context
      size: "0 KB", // Would be calculated after generation
    };
    
    await addRow("reports", report);
    
    return report as Report;
  } catch (error) {
    console.error("[AdminAPI] Error generating report:", error);
    throw error;
  }
}

// ============================================================================
// Settings API
// ============================================================================

/**
 * Fetch settings
 */
export async function fetchSettings(): Promise<Settings> {
  try {
    const settings = await getDocByPath<Settings>("settings/global");
    
    if (!settings) {
      // Return default settings
      return {
        notifications: { email: true, sms: false, push: true },
        security: { twoFactor: true, autoLogout: true, sessionTimeout: 30 },
        regional: { language: "en", timezone: "IST" },
        appearance: { darkMode: false, compactView: false },
        clinic: {
          name: "",
          address: "",
          phone: "",
          email: "",
          hours: "9:00 AM - 6:00 PM",
        },
        features: {},
      };
    }
    
    return settings;
  } catch (error) {
    console.error("[AdminAPI] Error fetching settings:", error);
    throw error;
  }
}

/**
 * Update settings
 */
export async function updateSettings(settings: Partial<Settings>): Promise<void> {
  try {
    await upsertById("settings", "global", {
      ...settings,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[AdminAPI] Error updating settings:", error);
    throw error;
  }
}

