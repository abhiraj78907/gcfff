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

// Mock data for development
const MOCK_USERS: AdminUser[] = [
  { id: "1", name: "Dr. Rajesh Kumar", email: "rajesh@aiims.in", roles: ["doctor"], entityId: "hosp-1", createdAt: "2024-01-15T10:00:00Z", updatedAt: "2024-01-15T10:00:00Z", entityName: "AIIMS Delhi" },
  { id: "2", name: "Priya Sharma", email: "priya@apollo.in", roles: ["admin"], entityId: "hosp-2", createdAt: "2024-01-10T10:00:00Z", updatedAt: "2024-01-10T10:00:00Z", entityName: "Apollo Hospital" },
  { id: "3", name: "Amit Patel", email: "amit@fortis.in", roles: ["receptionist"], entityId: "hosp-3", createdAt: "2024-01-20T10:00:00Z", updatedAt: "2024-01-20T10:00:00Z", entityName: "Fortis Hospital" },
  { id: "4", name: "Sunita Reddy", email: "sunita@medplus.in", roles: ["pharmacist"], entityId: "pharm-1", createdAt: "2024-01-12T10:00:00Z", updatedAt: "2024-01-12T10:00:00Z", entityName: "MedPlus Pharmacy" },
  { id: "5", name: "Dr. Vikram Singh", email: "vikram@cmc.in", roles: ["doctor"], entityId: "hosp-4", createdAt: "2024-01-18T10:00:00Z", updatedAt: "2024-01-18T10:00:00Z", entityName: "CMC Vellore" },
  { id: "6", name: "Anjali Mehta", email: "anjali@pathlabs.in", roles: ["lab-tech"], entityId: "lab-1", createdAt: "2024-01-14T10:00:00Z", updatedAt: "2024-01-14T10:00:00Z", entityName: "PathLabs" },
  { id: "7", name: "Rohit Gupta", email: "rohit@clinic.in", roles: ["receptionist"], entityId: "clinic-1", createdAt: "2024-01-16T10:00:00Z", updatedAt: "2024-01-16T10:00:00Z", entityName: "MedPlus Clinic" },
  { id: "8", name: "Dr. Kavita Nair", email: "kavita@apollo.in", roles: ["doctor"], entityId: "clinic-2", createdAt: "2024-01-19T10:00:00Z", updatedAt: "2024-01-19T10:00:00Z", entityName: "Apollo Clinic" },
];

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
    // For now, using Firestore directly with mock fallback
    let users: AdminUser[];
    try {
      users = await getCollection<AdminUser>("users");
      if (users.length === 0) {
        users = MOCK_USERS;
      }
    } catch {
      users = MOCK_USERS;
    }
    
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
    return MOCK_USERS; // Return mock data on error
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

// Mock entities data
const MOCK_ENTITIES: AdminEntity[] = [
  // Hospitals
  { id: "hosp-1", type: "hospital", name: "AIIMS Delhi", licenseNumber: "HSP-001", registrationDate: "2020-01-15", status: "active", totalUsers: 89, totalPatients: 1240, subEntries: [{ id: "sub-1", entityId: "hosp-1", name: "AIIMS Delhi", location: "New Delhi", address: "Ansari Nagar, New Delhi - 110029", contactPerson: "Dr. Ramesh Kumar", email: "contact@aiims.in", phone: "+91 11 26588500", status: "active", createdAt: "2020-01-15T10:00:00Z", updatedAt: "2024-01-15T10:00:00Z" }], createdAt: "2020-01-15T10:00:00Z", updatedAt: "2024-01-15T10:00:00Z" },
  { id: "hosp-2", type: "hospital", name: "Apollo Hospital", licenseNumber: "HSP-002", registrationDate: "2019-03-20", status: "active", totalUsers: 102, totalPatients: 1450, subEntries: [{ id: "sub-2", entityId: "hosp-2", name: "Apollo Hospital", location: "Mumbai", address: "Tardeo, Mumbai - 400034", contactPerson: "Dr. Priya Sharma", email: "info@apollo.in", phone: "+91 22 2490 1234", status: "active", createdAt: "2019-03-20T10:00:00Z", updatedAt: "2024-01-20T10:00:00Z" }], createdAt: "2019-03-20T10:00:00Z", updatedAt: "2024-01-20T10:00:00Z" },
  { id: "hosp-3", type: "hospital", name: "Fortis Hospital", licenseNumber: "HSP-003", registrationDate: "2018-06-10", status: "active", totalUsers: 67, totalPatients: 890, subEntries: [{ id: "sub-3", entityId: "hosp-3", name: "Fortis Hospital", location: "Gurgaon", address: "Sector 44, Gurgaon - 122009", contactPerson: "Dr. Amit Patel", email: "contact@fortis.in", phone: "+91 124 496 2000", status: "active", createdAt: "2018-06-10T10:00:00Z", updatedAt: "2024-01-10T10:00:00Z" }], createdAt: "2018-06-10T10:00:00Z", updatedAt: "2024-01-10T10:00:00Z" },
  { id: "hosp-4", type: "hospital", name: "CMC Vellore", licenseNumber: "HSP-004", registrationDate: "2021-02-14", status: "active", totalUsers: 78, totalPatients: 980, subEntries: [{ id: "sub-4", entityId: "hosp-4", name: "CMC Vellore", location: "Vellore", address: "Ida Scudder Road, Vellore - 632004", contactPerson: "Dr. Vikram Singh", email: "info@cmcvellore.ac.in", phone: "+91 416 222 2102", status: "active", createdAt: "2021-02-14T10:00:00Z", updatedAt: "2024-01-14T10:00:00Z" }], createdAt: "2021-02-14T10:00:00Z", updatedAt: "2024-01-14T10:00:00Z" },
  // Clinics
  { id: "clinic-1", type: "clinic", name: "MedPlus Clinic", licenseNumber: "CLN-001", registrationDate: "2022-05-10", status: "active", totalUsers: 12, totalPatients: 156, subEntries: [{ id: "sub-5", entityId: "clinic-1", name: "MedPlus Clinic", location: "Bangalore", address: "Koramangala, Bangalore - 560095", contactPerson: "Rohit Gupta", email: "info@medplus.in", phone: "+91 80 2555 1234", status: "active", createdAt: "2022-05-10T10:00:00Z", updatedAt: "2024-01-10T10:00:00Z" }], createdAt: "2022-05-10T10:00:00Z", updatedAt: "2024-01-10T10:00:00Z" },
  { id: "clinic-2", type: "clinic", name: "Apollo Clinic", licenseNumber: "CLN-002", registrationDate: "2021-08-22", status: "active", totalUsers: 15, totalPatients: 203, subEntries: [{ id: "sub-6", entityId: "clinic-2", name: "Apollo Clinic", location: "Chennai", address: "T. Nagar, Chennai - 600017", contactPerson: "Dr. Kavita Nair", email: "chennai@apollo.in", phone: "+91 44 2433 1234", status: "active", createdAt: "2021-08-22T10:00:00Z", updatedAt: "2024-01-22T10:00:00Z" }], createdAt: "2021-08-22T10:00:00Z", updatedAt: "2024-01-22T10:00:00Z" },
  { id: "clinic-3", type: "clinic", name: "HealthFirst Clinic", licenseNumber: "CLN-003", registrationDate: "2023-01-15", status: "active", totalUsers: 10, totalPatients: 142, subEntries: [{ id: "sub-7", entityId: "clinic-3", name: "HealthFirst Clinic", location: "Pune", address: "Kothrud, Pune - 411038", contactPerson: "Dr. Sameer Joshi", email: "info@healthfirst.in", phone: "+91 20 2545 5678", status: "active", createdAt: "2023-01-15T10:00:00Z", updatedAt: "2024-01-15T10:00:00Z" }], createdAt: "2023-01-15T10:00:00Z", updatedAt: "2024-01-15T10:00:00Z" },
  { id: "clinic-4", type: "clinic", name: "CarePlus Clinic", licenseNumber: "CLN-004", registrationDate: "2022-11-30", status: "active", totalUsers: 13, totalPatients: 178, subEntries: [{ id: "sub-8", entityId: "clinic-4", name: "CarePlus Clinic", location: "Hyderabad", address: "Banjara Hills, Hyderabad - 500034", contactPerson: "Dr. Anil Reddy", email: "contact@careplus.in", phone: "+91 40 2334 5678", status: "active", createdAt: "2022-11-30T10:00:00Z", updatedAt: "2024-01-30T10:00:00Z" }], createdAt: "2022-11-30T10:00:00Z", updatedAt: "2024-01-30T10:00:00Z" },
  // Pharmacies
  { id: "pharm-1", type: "pharmacy", name: "Apollo Pharmacy", licenseNumber: "PHM-001", registrationDate: "2020-09-12", status: "active", totalUsers: 8, totalPatients: 345, subEntries: [{ id: "sub-9", entityId: "pharm-1", name: "Apollo Pharmacy", location: "Delhi", address: "Connaught Place, New Delhi - 110001", contactPerson: "Sunita Reddy", email: "delhi@apollopharmacy.in", phone: "+91 11 2374 1234", status: "active", createdAt: "2020-09-12T10:00:00Z", updatedAt: "2024-01-12T10:00:00Z" }], createdAt: "2020-09-12T10:00:00Z", updatedAt: "2024-01-12T10:00:00Z" },
  { id: "pharm-2", type: "pharmacy", name: "MedPlus", licenseNumber: "PHM-002", registrationDate: "2021-04-18", status: "active", totalUsers: 6, totalPatients: 287, subEntries: [{ id: "sub-10", entityId: "pharm-2", name: "MedPlus", location: "Bangalore", address: "Indiranagar, Bangalore - 560038", contactPerson: "Rajesh Kumar", email: "blr@medplus.in", phone: "+91 80 2525 6789", status: "active", createdAt: "2021-04-18T10:00:00Z", updatedAt: "2024-01-18T10:00:00Z" }], createdAt: "2021-04-18T10:00:00Z", updatedAt: "2024-01-18T10:00:00Z" },
  { id: "pharm-3", type: "pharmacy", name: "HealthPlus", licenseNumber: "PHM-003", registrationDate: "2022-07-25", status: "active", totalUsers: 7, totalPatients: 412, subEntries: [{ id: "sub-11", entityId: "pharm-3", name: "HealthPlus", location: "Mumbai", address: "Andheri West, Mumbai - 400053", contactPerson: "Priya Mehta", email: "mumbai@healthplus.in", phone: "+91 22 2678 9012", status: "active", createdAt: "2022-07-25T10:00:00Z", updatedAt: "2024-01-25T10:00:00Z" }], createdAt: "2022-07-25T10:00:00Z", updatedAt: "2024-01-25T10:00:00Z" },
  // Labs
  { id: "lab-1", type: "lab", name: "PathLabs", licenseNumber: "LAB-001", registrationDate: "2019-12-05", status: "active", totalUsers: 15, totalPatients: 234, subEntries: [{ id: "sub-12", entityId: "lab-1", name: "PathLabs", location: "Delhi", address: "Saket, New Delhi - 110017", contactPerson: "Anjali Mehta", email: "delhi@pathlabs.in", phone: "+91 11 2956 7890", status: "active", createdAt: "2019-12-05T10:00:00Z", updatedAt: "2024-01-05T10:00:00Z" }], createdAt: "2019-12-05T10:00:00Z", updatedAt: "2024-01-05T10:00:00Z" },
  { id: "lab-2", type: "lab", name: "Dr. Lal PathLabs", licenseNumber: "LAB-002", registrationDate: "2020-03-20", status: "active", totalUsers: 18, totalPatients: 312, subEntries: [{ id: "sub-13", entityId: "lab-2", name: "Dr. Lal PathLabs", location: "Mumbai", address: "Andheri East, Mumbai - 400069", contactPerson: "Dr. Ravi Sharma", email: "mumbai@lalpathlabs.com", phone: "+91 22 2687 3456", status: "active", createdAt: "2020-03-20T10:00:00Z", updatedAt: "2024-01-20T10:00:00Z" }], createdAt: "2020-03-20T10:00:00Z", updatedAt: "2024-01-20T10:00:00Z" },
  { id: "lab-3", type: "lab", name: "Thyrocare", licenseNumber: "LAB-003", registrationDate: "2021-06-15", status: "active", totalUsers: 12, totalPatients: 189, subEntries: [{ id: "sub-14", entityId: "lab-3", name: "Thyrocare", location: "Chennai", address: "Adyar, Chennai - 600020", contactPerson: "Dr. Suresh Iyer", email: "chennai@thyrocare.com", phone: "+91 44 2445 6789", status: "active", createdAt: "2021-06-15T10:00:00Z", updatedAt: "2024-01-15T10:00:00Z" }], createdAt: "2021-06-15T10:00:00Z", updatedAt: "2024-01-15T10:00:00Z" },
];

/**
 * Fetch all entities
 */
export async function fetchEntities(type?: "hospital" | "clinic" | "pharmacy" | "lab"): Promise<AdminEntity[]> {
  try {
    let entities: AdminEntity[];
    try {
      entities = await getCollection<AdminEntity>("entities");
      if (entities.length === 0) {
        entities = MOCK_ENTITIES;
      }
    } catch {
      entities = MOCK_ENTITIES;
    }
    
    if (type) {
      return entities.filter(e => e.type === type);
    }
    
    return entities;
  } catch (error) {
    console.error("[AdminAPI] Error fetching entities:", error);
    return MOCK_ENTITIES.filter(e => type ? e.type === type : true); // Return mock data on error
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
      patientFlow: [
        { month: "Jan", registered: 3200, consultations: 2800, followups: 1200 },
        { month: "Feb", registered: 4100, consultations: 3600, followups: 1500 },
        { month: "Mar", registered: 3800, consultations: 3200, followups: 1400 },
        { month: "Apr", registered: 5200, consultations: 4800, followups: 2100 },
        { month: "May", registered: 6100, consultations: 5600, followups: 2400 },
        { month: "Jun", registered: 5800, consultations: 5200, followups: 2200 },
      ],
      departmentData: [
        { department: "General Medicine", patients: 2400 },
        { department: "Cardiology", patients: 1800 },
        { department: "Orthopedics", patients: 1600 },
        { department: "Pediatrics", patients: 2200 },
        { department: "ENT", patients: 1400 },
        { department: "Dermatology", patients: 1200 },
      ],
    };
  } catch (error) {
    console.error("[AdminAPI] Error fetching analytics:", error);
    throw error;
  }
}

// ============================================================================
// Audit Logs API
// ============================================================================

// Mock audit logs
const MOCK_AUDIT_LOGS: AuditLog[] = [
  { id: "1", userId: "1", userName: "Dr. Rajesh Kumar", action: "Updated patient record", entity: "AIIMS Delhi", entityId: "hosp-1", timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(), type: "update" },
  { id: "2", userId: "2", userName: "Priya Sharma", action: "Added new user account", entity: "Apollo Hospital", entityId: "hosp-2", timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), type: "create" },
  { id: "3", userId: "3", userName: "Amit Patel", action: "Registered new patient", entity: "Fortis Hospital", entityId: "hosp-3", timestamp: new Date(Date.now() - 23 * 60 * 1000).toISOString(), type: "create" },
  { id: "4", userId: "2", userName: "Priya Sharma", action: "Modified permissions", entity: "System", timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), type: "security" },
  { id: "5", userId: "4", userName: "Sunita Reddy", action: "Dispensed prescription", entity: "MedPlus Pharmacy", entityId: "pharm-1", timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), type: "transaction" },
  { id: "6", userId: "6", userName: "Anjali Mehta", action: "Processed lab test", entity: "PathLabs", entityId: "lab-1", timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(), type: "transaction" },
  { id: "7", userId: "1", userName: "Dr. Rajesh Kumar", action: "Created consultation report", entity: "AIIMS Delhi", entityId: "hosp-1", timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(), type: "create" },
  { id: "8", userId: "2", userName: "Priya Sharma", action: "Updated system settings", entity: "System", timestamp: new Date(Date.now() - 180 * 60 * 1000).toISOString(), type: "update" },
];

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
    let logs: AuditLog[];
    try {
      logs = await getCollection<AuditLog>("auditLogs");
      if (logs.length === 0) {
        logs = MOCK_AUDIT_LOGS;
      }
    } catch {
      logs = MOCK_AUDIT_LOGS;
    }
    
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
    return MOCK_AUDIT_LOGS; // Return mock data on error
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

// Mock alerts
const MOCK_ALERTS: Alert[] = [
  { id: "1", type: "critical", entity: "AIIMS Delhi", entityId: "hosp-1", message: "Inventory critically low for essential medicines", timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), acknowledged: false },
  { id: "2", type: "warning", entity: "Apollo Clinic", entityId: "clinic-2", message: "System maintenance scheduled for tonight", timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), acknowledged: false },
  { id: "3", type: "info", entity: "PathLabs", entityId: "lab-1", message: "New equipment successfully installed and calibrated", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), acknowledged: false },
  { id: "4", type: "critical", entity: "MedPlus Pharmacy", entityId: "pharm-1", message: "Stock shortage detected for 5 medicines", timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), acknowledged: false },
  { id: "5", type: "warning", entity: "Fortis Hospital", entityId: "hosp-3", message: "High patient queue in Emergency department", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), acknowledged: false },
  { id: "6", type: "info", entity: "Apollo Hospital", entityId: "hosp-2", message: "Monthly report generated successfully", timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), acknowledged: true, acknowledgedBy: "admin-1", acknowledgedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
];

/**
 * Fetch alerts
 */
export async function fetchAlerts(params?: {
  type?: "critical" | "warning" | "info";
  entityId?: string;
  acknowledged?: boolean;
}): Promise<Alert[]> {
  try {
    let alerts: Alert[];
    try {
      alerts = await getCollection<Alert>("alerts");
      if (alerts.length === 0) {
        alerts = MOCK_ALERTS;
      }
    } catch {
      alerts = MOCK_ALERTS;
    }
    
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
    return MOCK_ALERTS; // Return mock data on error
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

// Mock reports
const MOCK_REPORTS: Report[] = [
  { id: "1", name: "Q2 2025 Summary", type: "analytics", generatedAt: "2025-06-30T10:00:00Z", generatedBy: "admin-1", format: "PDF", size: "2.4 MB" },
  { id: "2", name: "May Operations Report", type: "performance", generatedAt: "2025-06-01T10:00:00Z", generatedBy: "admin-1", format: "PDF", size: "1.8 MB" },
  { id: "3", name: "Weekly Analytics", type: "analytics", generatedAt: new Date().toISOString(), generatedBy: "admin-1", format: "CSV", size: "890 KB" },
  { id: "4", name: "AIIMS Delhi - Performance Report", type: "performance", generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), generatedBy: "admin-1", format: "Excel", size: "1.2 MB" },
  { id: "5", name: "Revenue Summary Q1", type: "financial", generatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), generatedBy: "admin-1", format: "PDF", size: "3.1 MB" },
];

/**
 * Fetch reports
 */
export async function fetchReports(): Promise<Report[]> {
  try {
    let reports: Report[];
    try {
      reports = await getCollection<Report>("reports");
      if (reports.length === 0) {
        reports = MOCK_REPORTS;
      }
    } catch {
      reports = MOCK_REPORTS;
    }
    reports.sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime());
    return reports;
  } catch (error) {
    console.error("[AdminAPI] Error fetching reports:", error);
    return MOCK_REPORTS; // Return mock data on error
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

