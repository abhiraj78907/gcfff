import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UserRole } from "../../../../src/types/entities";
import { demoUsersByEntity } from "../../../../src/lib/mocks/demoUsers";

type Props = {
  onAutofill: (params: { entityId: string; role: UserRole; username: string; password: string }) => void;
};

const entityName: Record<string, string> = {
  "entity-apo": "Apollo Hospital",
  "entity-grn": "GreenLife Clinic",
  "entity-med": "MediTown Pharmacy",
};

const ALL_ROLES: UserRole[] = ["admin", "doctor", "receptionist", "lab-tech", "pharmacist", "patient"];

export function DemoLogin({ onAutofill }: Props) {
  // Default to enabled unless explicitly disabled
  const flag = (import.meta as any).env?.VITE_ENABLE_DEMO_LOGIN;
  const enabled = flag === undefined || flag === null || flag === "true";
  if (!enabled) return null;

  const debug = (import.meta as any).env?.VITE_DEBUG_DEMO_LOGIN === "true";

  const entities = useMemo(() => Object.keys(demoUsersByEntity).map((id) => ({ id, name: entityName[id] ?? id })), []);
  const [selectedEntity, setSelectedEntity] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");

  useEffect(() => {
    try {
      const e = window.localStorage.getItem("demo:lastEntity") || "";
      const r = window.localStorage.getItem("demo:lastRole") as UserRole | null;
      if (e) setSelectedEntity(e);
      if (r) setSelectedRole(r);
    } catch {}
  }, []);

  const rolesForEntity: UserRole[] = useMemo(() => {
    if (!selectedEntity) return [];
    const pool = demoUsersByEntity[selectedEntity] || [];
    const roles = Array.from(new Set(pool.map((u) => u.role)));
    return roles.sort((a, b) => ALL_ROLES.indexOf(a) - ALL_ROLES.indexOf(b));
  }, [selectedEntity]);

  useEffect(() => {
    if (!selectedEntity || !selectedRole) return;
    const pool = demoUsersByEntity[selectedEntity] || [];
    const user = pool.find((u) => u.role === selectedRole);
    if (!user) return;
    const cb = () => {
      if (debug) console.debug("[DemoLogin] autofill", { selectedEntity, selectedRole, username: user.username });
      onAutofill({ entityId: selectedEntity, role: selectedRole, username: user.username, password: user.password });
      try {
        window.localStorage.setItem("demo:lastEntity", selectedEntity);
        window.localStorage.setItem("demo:lastRole", selectedRole);
      } catch {}
    };
    const t = window.setTimeout(cb, 150);
    return () => window.clearTimeout(t);
  }, [selectedEntity, selectedRole, onAutofill, debug]);

  return (
    <Card className="p-3 space-y-3 border-muted">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Demo Login</div>
        <div className="text-[10px] text-muted-foreground">Dev-only</div>
      </div>
      <div className="grid gap-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label htmlFor="demo-entity">Institution</Label>
            <Select value={selectedEntity} onValueChange={setSelectedEntity}>
              <SelectTrigger id="demo-entity" aria-label="Select demo institution">
                <SelectValue placeholder="Choose institution" />
              </SelectTrigger>
              <SelectContent>
                {entities.map((e) => (
                  <SelectItem key={e.id} value={e.id} aria-label={`Select ${e.name}`}>{e.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="demo-role">Role</Label>
            <Select value={selectedRole || undefined} onValueChange={(v) => setSelectedRole(v as UserRole)} disabled={!selectedEntity}>
              <SelectTrigger id="demo-role" aria-label="Select demo role">
                <SelectValue placeholder={selectedEntity ? "Choose role" : "Select institution first"} />
              </SelectTrigger>
              <SelectContent>
                {rolesForEntity.map((r) => (
                  <SelectItem key={r} value={r} aria-label={`Select role ${r}`}>{r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default DemoLogin;


