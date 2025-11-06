import { useSubEntry } from "../contexts/SubEntryContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const SubEntrySwitcher = () => {
  const { entities, subEntries, currentEntityId, currentSubEntryId, setEntity, setSubEntry } = useSubEntry();

  return (
    <div className="flex items-center gap-3">
      <div className="w-56">
        <Select value={currentEntityId ?? undefined} onValueChange={setEntity}>
          <SelectTrigger aria-label="Select entity">
            <SelectValue placeholder="Select Entity" />
          </SelectTrigger>
          <SelectContent>
            {entities.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-64">
        <Select value={currentSubEntryId ?? undefined} onValueChange={setSubEntry}>
          <SelectTrigger aria-label="Select sub-entry">
            <SelectValue placeholder="Select Sub-Entry" />
          </SelectTrigger>
          <SelectContent>
            {subEntries
              .filter((s) => s.entityId === currentEntityId)
              .map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};


