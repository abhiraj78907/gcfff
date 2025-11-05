import { Building2, MapPin, Users, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";

const mockClinics = [
  { id: 1, name: "MedPlus Clinic", location: "Bangalore", patients: 156, doctors: 12, status: "active" },
  { id: 2, name: "Apollo Clinic", location: "Chennai", patients: 203, doctors: 15, status: "active" },
  { id: 3, name: "HealthFirst Clinic", location: "Pune", patients: 142, doctors: 10, status: "active" },
  { id: 4, name: "CarePlus Clinic", location: "Hyderabad", patients: 178, doctors: 13, status: "active" },
  { id: 5, name: "Wellness Clinic", location: "Kolkata", patients: 134, doctors: 9, status: "maintenance" },
];

const Clinics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Clinics</h1>
          <p className="text-muted-foreground">Manage and monitor all clinic entities</p>
        </div>
        <Button className="bg-gradient-primary">
          <Building2 className="mr-2 h-4 w-4" />
          Add Clinic
        </Button>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Search clinics..." className="max-w-md" />
        <Button variant="outline">Filters</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-secondary mb-2">156</p>
              <p className="text-sm text-muted-foreground">Total Clinics</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-success mb-2">152</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">2,340</p>
              <p className="text-sm text-muted-foreground">Total Patients Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockClinics.map((clinic) => (
          <Card key={clinic.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-secondary/10">
                    <Building2 className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <CardTitle>{clinic.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {clinic.location}
                    </CardDescription>
                  </div>
                </div>
                <Badge 
                  variant="outline" 
                  className={clinic.status === "active" ? "bg-success/10 text-success border-success/20" : "bg-warning/10 text-warning border-warning/20"}
                >
                  {clinic.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 text-center p-3 bg-muted rounded-lg">
                  <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">{clinic.patients}</p>
                  <p className="text-xs text-muted-foreground">Patients</p>
                </div>
                <div className="flex-1 text-center p-3 bg-muted rounded-lg">
                  <Activity className="h-4 w-4 mx-auto mb-1 text-secondary" />
                  <p className="text-lg font-bold">{clinic.doctors}</p>
                  <p className="text-xs text-muted-foreground">Doctors</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Clinics;
