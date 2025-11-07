import { toast } from "@/hooks/use-toast";
import type { UserRole } from "@/types/entities";

/**
 * Notification helpers for action completion
 * Provides consistent toast notifications across the app
 */

export const notifySuccess = (action: string, details?: string) => {
  toast({
    title: `${action} Successful`,
    description: details || `${action} completed successfully.`,
  });
};

export const notifyError = (action: string, error: unknown) => {
  const message = error instanceof Error ? error.message : "An unexpected error occurred.";
  toast({
    title: `${action} Failed`,
    description: message,
    variant: "destructive",
  });
};

export const notifyLabResultReady = (patientName: string, testType: string) => {
  toast({
    title: "Lab Results Ready",
    description: `${testType} results for ${patientName} are now available.`,
  });
};

export const notifyPrescriptionDispensed = (patientName: string) => {
  toast({
    title: "Prescription Dispensed",
    description: `Prescription for ${patientName} has been dispensed.`,
  });
};

export const notifyQueueUpdate = (token: string, action: string) => {
  toast({
    title: "Queue Updated",
    description: `Token ${token}: ${action}`,
  });
};

export const notifyConsultationComplete = (patientName: string) => {
  toast({
    title: "Consultation Complete",
    description: `Consultation for ${patientName} has been saved.`,
  });
};

/**
 * Role-specific notification helpers
 */
export const notifyByRole = {
  doctor: {
    consultationSaved: (patientName: string) => notifyConsultationComplete(patientName),
    prescriptionCreated: (patientName: string) => notifySuccess("Prescription Created", `Prescription for ${patientName} has been created.`),
    labOrdered: (testType: string) => notifySuccess("Lab Order Created", `${testType} has been ordered.`),
  },
  lab: {
    resultUploaded: (patientName: string, testType: string) => notifyLabResultReady(patientName, testType),
    statusUpdated: (status: string) => notifySuccess("Status Updated", `Test status updated to ${status}.`),
  },
  pharmacist: {
    dispensed: (patientName: string) => notifyPrescriptionDispensed(patientName),
    inventoryLow: (drugName: string) => toast({
      title: "Low Stock Alert",
      description: `${drugName} is running low on stock.`,
      variant: "destructive",
    }),
  },
  receptionist: {
    patientRegistered: (token: string) => notifyQueueUpdate(token, "Patient registered successfully"),
    queueUpdated: (token: string) => notifyQueueUpdate(token, "Queue position updated"),
  },
};

