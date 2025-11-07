/**
 * Test utilities and helpers for MediChain testing
 */

import { render, RenderOptions } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "../../src/contexts/AuthContext";
import { LanguageProvider } from "../../src/contexts/LanguageContext";
import { SubEntryProvider } from "../../src/contexts/SubEntryContext";
import type { UserProfile, UserRole } from "../../src/types/entities";
import React from "react";

/**
 * Create test user profile
 */
export function createTestUser(
  role: UserRole,
  entityId?: string,
  subEntryId?: string
): UserProfile {
  return {
    id: `test-${role}-1`,
    name: `Test ${role}`,
    email: `test-${role}@medichain.test`,
    roles: [role],
    primaryRole: role,
    entityId: entityId || "test-entity-1",
    subEntryId: subEntryId || "test-subentry-1",
  };
}

/**
 * Custom render with all providers
 */
export function renderWithProviders(
  ui: React.ReactElement,
  {
    user = null,
    entityId = "test-entity-1",
    subEntryId = "test-subentry-1",
    ...renderOptions
  }: RenderOptions & {
    user?: UserProfile | null;
    entityId?: string;
    subEntryId?: string;
  } = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <BrowserRouter>
            <AuthProvider>
              <SubEntryProvider userId={user?.id || "test-user"}>
                {children}
              </SubEntryProvider>
            </AuthProvider>
          </BrowserRouter>
        </LanguageProvider>
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Wait for Firestore operation to complete
 */
export async function waitForFirestore() {
  return new Promise((resolve) => setTimeout(resolve, 100));
}

/**
 * Mock Firestore document
 */
export function createMockDoc<T>(data: Partial<T>, id: string = "doc-1") {
  return {
    id,
    ...data,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  } as T & { id: string };
}

/**
 * Test data generators
 */
export const testData = {
  patient: () => ({
    id: "patient-1",
    name: "Test Patient",
    age: "30",
    gender: "M",
    contact: "+91 9876543210",
  }),

  prescription: () => ({
    id: "presc-1",
    patientId: "patient-1",
    doctorId: "doctor-1",
    doctorName: "Dr. Test",
    medicines: [
      {
        drugId: "drug-1",
        drugName: "Paracetamol 500mg",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "5 days",
      },
    ],
    status: "current",
    date: new Date().toISOString(),
  }),

  labRequest: () => ({
    id: "lab-req-1",
    patientId: "patient-1",
    doctorId: "doctor-1",
    testType: "Complete Blood Count",
    status: "ordered" as const,
    createdAt: Date.now(),
  }),

  appointment: () => ({
    id: "apt-1",
    patientId: "patient-1",
    doctorId: "doctor-1",
    date: new Date().toISOString(),
    time: "10:00",
    reason: "Follow-up",
    status: "upcoming" as const,
  }),
};

