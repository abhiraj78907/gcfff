import { Pill, MapPin, Package, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";

const mockPharmacies = [
  { id: 1, name: "Apollo Pharmacy", location: "Delhi", prescriptions: 345, stock: "Good", status: "active" },
  { id: 2, name: "MedPlus", location: "Bangalore", prescriptions: 287, stock: "Low", status: "active" },
  { id: 3, name: "HealthPlus", location: "Mumbai", prescriptions: 412, stock: "Good", status: "active" },
];

const Pharmacies = () => {
  return (
    <div className="space-y-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Pharmacies</h1>
          <p className="text-sm sm:text-base text-muted-foreground">Manage pharmacy inventory and operations</p>
        </div>
        <Button className="bg-gradient-primary w-full sm:w-auto">
          <Pill className="mr-2 h-4 w-4" />
          Add Pharmacy
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Input placeholder="Search pharmacies..." className="w-full sm:max-w-md" />
        <Button variant="outline" className="w-full sm:w-auto">Filters</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">89</p>
              <p className="text-sm text-muted-foreground">Total Pharmacies</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-success mb-2">87</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">3,210</p>
              <p className="text-sm text-muted-foreground">Prescriptions Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {mockPharmacies.map((pharmacy) => (
          <Card key={pharmacy.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-3 rounded-lg bg-accent/10 flex-shrink-0">
                    <Pill className="h-6 w-6 text-accent" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <CardTitle className="text-lg sm:text-xl break-words">{pharmacy.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1 break-words">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{pharmacy.location}</span>
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20 flex-shrink-0">
                  {pharmacy.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <TrendingUp className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <p className="text-base sm:text-lg font-bold break-words">{pharmacy.prescriptions}</p>
                  <p className="text-xs text-muted-foreground break-words">Prescriptions</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Package className="h-4 w-4 mx-auto mb-1 text-accent" />
                  <p className="text-base sm:text-lg font-bold break-words">{pharmacy.stock}</p>
                  <p className="text-xs text-muted-foreground break-words">Stock Level</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg flex items-center justify-center">
                  <Button variant="ghost" size="sm" className="text-xs w-full sm:w-auto">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Pharmacies;
