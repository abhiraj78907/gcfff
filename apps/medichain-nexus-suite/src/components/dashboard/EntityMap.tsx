import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { MapPin, Hospital, Building2, Pill, FlaskConical } from "lucide-react";

interface EntityLocation {
  id: string;
  name: string;
  type: "hospital" | "clinic" | "pharmacy" | "lab";
  lat: number;
  lng: number;
  status: "active" | "inactive" | "critical";
  patients?: number;
}

const mockLocations: EntityLocation[] = [
  { id: "1", name: "AIIMS Delhi", type: "hospital", lat: 28.5672, lng: 77.2100, status: "active", patients: 1240 },
  { id: "2", name: "Fortis Hospital", type: "hospital", lat: 28.6315, lng: 77.2167, status: "active", patients: 890 },
  { id: "3", name: "Apollo Pharmacy", type: "pharmacy", lat: 28.5355, lng: 77.3910, status: "active" },
  { id: "4", name: "MedPlus Clinic", type: "clinic", lat: 28.7041, lng: 77.1025, status: "active", patients: 156 },
  { id: "5", name: "PathLabs", type: "lab", lat: 28.4595, lng: 77.0266, status: "critical" },
];

export const EntityMap = () => {
  const getIcon = (type: string) => {
    switch (type) {
      case "hospital":
        return Hospital;
      case "clinic":
        return Building2;
      case "pharmacy":
        return Pill;
      case "lab":
        return FlaskConical;
      default:
        return MapPin;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success";
      case "inactive":
        return "bg-muted";
      case "critical":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
        <CardDescription>Healthcare entities across regions</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Placeholder map with entity pins */}
        <div className="relative h-[400px] bg-muted rounded-lg overflow-hidden">
          {/* Map background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
          
          {/* Entity markers */}
          <div className="absolute inset-0 p-6">
            {mockLocations.map((location, index) => {
              const Icon = getIcon(location.type);
              // Distribute entities across the map
              const top = 10 + (index * 15) % 70;
              const left = 10 + (index * 23) % 75;
              
              return (
                <div
                  key={location.id}
                  className="absolute group cursor-pointer"
                  style={{ top: `${top}%`, left: `${left}%` }}
                >
                  <div className="relative">
                    <div className={`p-2 rounded-full ${getStatusColor(location.status)} shadow-lg animate-pulse`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                      <div className="bg-card border border-border rounded-lg p-3 shadow-xl min-w-[200px]">
                        <h4 className="font-semibold text-sm mb-1">{location.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="capitalize">
                            {location.type}
                          </Badge>
                          <Badge className={getStatusColor(location.status)}>
                            {location.status}
                          </Badge>
                        </div>
                        {location.patients && (
                          <p className="text-xs text-muted-foreground mt-2">
                            {location.patients} patients today
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg">
            <h4 className="text-xs font-semibold mb-2">Entity Types</h4>
            <div className="space-y-1">
              {[
                { icon: Hospital, label: "Hospitals", count: 24 },
                { icon: Building2, label: "Clinics", count: 156 },
                { icon: Pill, label: "Pharmacies", count: 89 },
                { icon: FlaskConical, label: "Labs", count: 43 },
              ].map(({ icon: Icon, label, count }) => (
                <div key={label} className="flex items-center gap-2 text-xs">
                  <Icon className="h-3 w-3 text-primary" />
                  <span className="text-muted-foreground">{label}</span>
                  <span className="ml-auto font-medium">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
