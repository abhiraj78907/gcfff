export type Patient = {
  id: string;
  entityId: string;
  subEntryId: string;
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  phone: string;
  symptoms?: string;
};

export const mockPatients: Patient[] = [
  { id: "p-1", entityId: "entity-1", subEntryId: "sub-1", name: "Ravi Kumar", age: 42, gender: "male", phone: "+91-9000000001", symptoms: "Fever, cough" },
  { id: "p-2", entityId: "entity-1", subEntryId: "sub-1", name: "Anita Sharma", age: 29, gender: "female", phone: "+91-9000000002", symptoms: "Headache" },
  { id: "p-3", entityId: "entity-1", subEntryId: "sub-2", name: "Suresh Gupta", age: 55, gender: "male", phone: "+91-9000000003", symptoms: "Chest pain" },
];


