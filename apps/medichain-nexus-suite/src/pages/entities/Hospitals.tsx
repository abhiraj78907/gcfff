import { Hospital, MapPin, Phone, Users, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";

const mockHospitals = [
  { id: 1, name: "AIIMS Delhi", location: "New Delhi", patients: 1240, doctors: 89, status: "active", beds: 2500 },
  { id: 2, name: "Fortis Hospital", location: "Gurgaon", patients: 890, doctors: 67, status: "active", beds: 1800 },
  { id: 3, name: "Apollo Hospital", location: "Mumbai", patients: 1450, doctors: 102, status: "active", beds: 3200 },
  { id: 4, name: "CMC Vellore", location: "Vellore", patients: 980, doctors: 78, status: "active", beds: 2100 },
];

const Hospitals = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Hospitals</h1>
          <p className="text-muted-foreground">Manage and monitor all hospital entities</p>
        </div>
        <Button className="bg-gradient-primary">
          <Hospital className="mr-2 h-4 w-4" />
          Add Hospital
        </Button>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Search hospitals..." className="max-w-md" />
        <Button variant="outline">Filters</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">24</p>
              <p className="text-sm text-muted-foreground">Total Hospitals</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-success mb-2">23</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">5,560</p>
              <p className="text-sm text-muted-foreground">Total Patients Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {mockHospitals.map((hospital) => (
          <Card key={hospital.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Hospital className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{hospital.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {hospital.location}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  {hospital.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Users className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">{hospital.patients}</p>
                  <p className="text-xs text-muted-foreground">Patients</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Activity className="h-4 w-4 mx-auto mb-1 text-secondary" />
                  <p className="text-lg font-bold">{hospital.doctors}</p>
                  <p className="text-xs text-muted-foreground">Doctors</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Hospital className="h-4 w-4 mx-auto mb-1 text-accent" />
                  <p className="text-lg font-bold">{hospital.beds}</p>
                  <p className="text-xs text-muted-foreground">Beds</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Phone className="h-4 w-4 mx-auto mb-1 text-info" />
                  <Button variant="ghost" size="sm" className="text-xs mt-1">Contact</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Hospitals;
