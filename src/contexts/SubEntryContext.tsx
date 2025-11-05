import { createContext, useContext, useMemo, useState, ReactNode } from "react";
import { mockEntities, mockSubEntries } from "@/lib/mocks/entities";
import type { Entity, SubEntry } from "@/types/entities";

type SubEntryContextValue = {
  entities: Entity[];
  subEntries: SubEntry[];
  currentEntityId: string | null;
  currentSubEntryId: string | null;
  setEntity: (entityId: string) => void;
  setSubEntry: (subEntryId: string) => void;
  currentEntity: Entity | null;
  currentSubEntry: SubEntry | null;
};

const SubEntryContext = createContext<SubEntryContextValue | undefined>(undefined);

export const SubEntryProvider = ({ children, userId }: { children: ReactNode; userId: string }) => {
  const [currentEntityId, setCurrentEntityId] = useState<string | null>(mockEntities[0]?.id ?? null);
  const [currentSubEntryId, setCurrentSubEntryId] = useState<string | null>(mockSubEntries[0]?.id ?? null);

  const value = useMemo<SubEntryContextValue>(() => {
    const currentEntity = mockEntities.find((e) => e.id === currentEntityId) ?? null;
    const currentSubEntry = mockSubEntries.find((s) => s.id === currentSubEntryId) ?? null;
    return {
      entities: mockEntities,
      subEntries: mockSubEntries,
      currentEntityId,
      currentSubEntryId,
      setEntity: (entityId: string) => {
        setCurrentEntityId(entityId);
        const firstSub = mockSubEntries.find((s) => s.entityId === entityId);
        setCurrentSubEntryId(firstSub ? firstSub.id : null);
      },
      setSubEntry: setCurrentSubEntryId,
      currentEntity,
      currentSubEntry,
    };
  }, [currentEntityId, currentSubEntryId]);

  return <SubEntryContext.Provider value={value}>{children}</SubEntryContext.Provider>;
};

export const useSubEntry = (): SubEntryContextValue => {
  const ctx = useContext(SubEntryContext);
  if (!ctx) throw new Error("useSubEntry must be used within SubEntryProvider");
  return ctx;
};


