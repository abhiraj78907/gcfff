import { addRow, paths, patchById } from "./db";
import type { EntityId } from "./firebaseTypes";

export type LabResult = {
  requestId: string;
  testType: string;
  resultUrl?: string;
  values?: Record<string, unknown>;
  verifiedBy?: string;
  notes?: string;
};

/**
 * Upload lab results and attach to patient record
 */
export async function uploadLabResult(
  entityId: EntityId,
  patientId: string,
  requestId: string,
  result: LabResult
): Promise<void> {
  const resultsPath = paths.labResults(entityId, patientId);
  
  // Add result to patient's lab results collection
  await addRow(resultsPath, {
    requestId,
    testType: result.testType,
    resultUrl: result.resultUrl,
    values: result.values,
    verifiedBy: result.verifiedBy,
    notes: result.notes,
    createdAt: Date.now(),
  });

  // Update the lab request status to completed
  const requestsPath = paths.labRequests(entityId);
  await patchById(requestsPath, requestId, {
    status: "completed",
    resultUrl: result.resultUrl,
  });
}

