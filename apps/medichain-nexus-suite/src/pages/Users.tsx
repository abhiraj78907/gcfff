import { Users as UsersIcon, UserPlus, Shield, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";
import { Avatar, AvatarFallback } from "@admin/components/ui/avatar";

const mockUsers = [
  { id: 1, name: "Dr. Rajesh Kumar", email: "rajesh@aiims.in", role: "Doctor", entity: "AIIMS Delhi", status: "active" },
  { id: 2, name: "Priya Sharma", email: "priya@apollo.in", role: "Admin", entity: "Apollo Hospital", status: "active" },
  { id: 3, name: "Amit Patel", email: "amit@fortis.in", role: "Receptionist", entity: "Fortis Hospital", status: "active" },
  { id: 4, name: "Sunita Reddy", email: "sunita@medplus.in", role: "Pharmacist", entity: "MedPlus Pharmacy", status: "inactive" },
];

const Users = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Users & Roles</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button className="bg-gradient-primary">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Search users..." className="max-w-md" />
        <Button variant="outline">Filters</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">1,248</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-success mb-2">1,182</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">45</p>
              <p className="text-sm text-muted-foreground">Admins</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-secondary mb-2">890</p>
              <p className="text-sm text-muted-foreground">Doctors</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>All registered users across entities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{user.name}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{user.entity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                    <Shield className="h-3 w-3 mr-1" />
                    {user.role}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={user.status === "active" ? "bg-success/10 text-success border-success/20" : "bg-muted"}
                  >
                    {user.status}
                  </Badge>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
