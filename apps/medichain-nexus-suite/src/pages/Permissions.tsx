import { Shield, Lock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";

const roles = [
  { id: 1, name: "Super Admin", users: 5, permissions: ["All Access"], color: "destructive" },
  { id: 2, name: "Hospital Admin", users: 24, permissions: ["Hospital Management", "User Management"], color: "primary" },
  { id: 3, name: "Doctor", users: 890, permissions: ["Patient Records", "Prescriptions"], color: "secondary" },
  { id: 4, name: "Receptionist", users: 234, permissions: ["Registration", "Appointments"], color: "accent" },
];

const Permissions = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Permissions & Roles</h1>
          <p className="text-muted-foreground">Configure access control and role permissions</p>
        </div>
        <Button className="bg-gradient-primary">
          <Shield className="mr-2 h-4 w-4" />
          Create Role
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">12</p>
              <p className="text-sm text-muted-foreground">Total Roles</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-success mb-2">1,153</p>
              <p className="text-sm text-muted-foreground">Assigned Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">48</p>
              <p className="text-sm text-muted-foreground">Permissions</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-warning mb-2">5</p>
              <p className="text-sm text-muted-foreground">Custom Roles</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-${role.color}/10`}>
                    <Shield className={`h-6 w-6 text-${role.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{role.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {role.users} users assigned
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Edit Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="text-sm font-semibold flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Permissions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission, idx) => (
                    <Badge key={idx} variant="outline" className="bg-muted">
                      <CheckCircle className="h-3 w-3 mr-1 text-success" />
                      {permission}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Permissions;
