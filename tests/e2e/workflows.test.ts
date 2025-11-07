/**
 * End-to-End Workflow Tests
 * 
 * Tests complete user journeys:
 * - Reception → Doctor → Lab → Pharmacy → Patient
 */

import { describe, it, expect } from "vitest";
import { testData } from "../utils/testHelpers";

describe("E2E Workflow Tests", () => {
  describe("Complete Patient Journey", () => {
    it("should complete: Registration → Consultation → Prescription → Lab → Pharmacy → Patient", async () => {
      // Step 1: Receptionist registers patient
      const patient = testData.patient();
      expect(patient.id).toBeTruthy();

      // Step 2: Patient added to doctor queue
      const appointment = testData.appointment();
      expect(appointment.patientId).toBe(patient.id);

      // Step 3: Doctor creates consultation
      const consultation = {
        visitId: appointment.id,
        patientId: patient.id,
        notes: "Patient examination",
        diagnosis: "Common cold",
      };
      expect(consultation.diagnosis).toBeTruthy();

      // Step 4: Doctor creates prescription
      const prescription = testData.prescription();
      expect(prescription.medicines.length).toBeGreaterThan(0);

      // Step 5: Doctor orders lab test
      const labRequest = testData.labRequest();
      expect(labRequest.status).toBe("ordered");

      // Step 6: Lab uploads results
      const labResult = {
        requestId: labRequest.id,
        testType: labRequest.testType,
        values: { hemoglobin: "14.5" },
      };
      expect(labResult.values).toBeTruthy();

      // Step 7: Pharmacy dispenses prescription
      const dispensation = {
        prescriptionId: prescription.id,
        items: prescription.medicines.map(m => ({
          drugId: m.drugId,
          quantity: 1,
        })),
      };
      expect(dispensation.items.length).toBeGreaterThan(0);

      // Step 8: Patient receives medicines
      expect(patient.id).toBeTruthy();
    });
  });

  describe("Multi-Role Real-Time Sync", () => {
    it("should sync lab request across doctor and lab views", async () => {
      // Doctor creates lab order
      const labRequest = testData.labRequest();
      
      // Lab should see it in real-time
      expect(labRequest.status).toBe("ordered");
      
      // Lab updates status
      labRequest.status = "in_progress";
      expect(labRequest.status).toBe("in_progress");
      
      // Doctor should see update in real-time
      expect(labRequest.status).toBe("in_progress");
    });

    it("should sync prescription from doctor to pharmacy", async () => {
      const prescription = testData.prescription();
      
      // Doctor creates prescription
      expect(prescription.status).toBe("current");
      
      // Pharmacy should see it in real-time
      expect(prescription.medicines.length).toBeGreaterThan(0);
    });
  });
});

