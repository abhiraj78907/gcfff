/**
 * Entity Map Component
 * Interactive map showing healthcare entities with click handlers
 * Currently uses a placeholder visualization - can be replaced with real map integration
 */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { MapPin, Hospital, Building2, Pill, FlaskConical } from "lucide-react";
import { useAdminEntities } from "../../hooks/useAdminEntities";
import { useMemo } from "react";

export const EntityMap = () => {
  const { data: entities = [] } = useAdminEntities();

  // Transform entities to map locations
  const mapLocations = useMemo(() => {
    return entities.map((entity, index) => {
      // Mock coordinates - in production, use actual lat/lng from entity data
      const baseLat = 28.6139; // Delhi coordinates
      const baseLng = 77.2090;
      const offset = index * 0.01; // Spread entities around
      
      return {
        id: entity.id,
        name: entity.name,
        type: entity.type,
        lat: baseLat + (Math.random() - 0.5) * offset,
        lng: baseLng + (Math.random() - 0.5) * offset,
        status: entity.status,
        patients: entity.totalPatients,
      };
    });
  }, [entities]);

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
      case "maintenance":
        return "bg-warning";
      case "critical":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  // Markers are display-only - no navigation

  // Count entities by type
  const entityCounts = useMemo(() => {
    const counts = { hospital: 0, clinic: 0, pharmacy: 0, lab: 0 };
    entities.forEach((e) => {
      if (e.type in counts) {
        counts[e.type as keyof typeof counts]++;
      }
    });
    return counts;
  }, [entities]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Geographic Distribution</CardTitle>
        <CardDescription>Healthcare entities across regions</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Map with entity pins */}
        <div className="relative h-[400px] bg-muted rounded-lg overflow-hidden border border-border">
          {/* Map background image - Karnataka map outline */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3ClinearGradient id='karnatakaGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f0f9ff;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23e0f2fe;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23dbeafe;stop-opacity:1' /%3E%3C/linearGradient%3E%3Cpattern id='mapGrid' width='50' height='50' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 50 0 L 0 0 0 50' fill='none' stroke='%233b82f6' stroke-width='0.3' opacity='0.08'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='800' height='600' fill='url(%23karnatakaGrad)'/%3E%3Crect width='800' height='600' fill='url(%23mapGrid)'/%3E%3Cpath d='M 150 80 L 180 75 L 220 70 L 260 68 L 300 70 L 340 75 L 380 82 L 420 90 L 460 100 L 500 115 L 540 135 L 580 160 L 620 190 L 650 220 L 670 250 L 680 280 L 685 310 L 680 340 L 670 370 L 650 400 L 620 425 L 580 445 L 540 460 L 500 470 L 460 475 L 420 478 L 380 480 L 340 478 L 300 475 L 260 470 L 220 460 L 180 445 L 150 425 L 130 400 L 115 370 L 105 340 L 100 310 L 105 280 L 115 250 L 130 220 L 150 190 L 150 160 L 150 130 L 150 100 Z' fill='%2360a5fa' stroke='%231e40af' stroke-width='2.5' opacity='0.25'/%3E%3Cpath d='M 200 120 L 250 115 L 300 110 L 350 108 L 400 110 L 450 115 L 500 125 L 550 140 L 590 160 L 620 185 L 640 215 L 650 250 L 645 285 L 630 320 L 600 350 L 560 375 L 510 395 L 450 410 L 400 415 L 350 418 L 300 415 L 250 410 L 200 395 L 160 375 L 130 350 L 110 320 L 100 285 L 105 250 L 115 215 L 140 185 L 170 160 L 200 140 Z' fill='%2393c5fd' stroke='%233b82f6' stroke-width='2' opacity='0.2'/%3E%3Ccircle cx='400' cy='280' r='8' fill='%233b82f6' opacity='0.4'/%3E%3Ctext x='400' y='285' font-family='Arial, sans-serif' font-size='18' font-weight='bold' fill='%231e40af' text-anchor='middle' opacity='0.6'%3EBangalore%3C/text%3E%3Ctext x='400' y='520' font-family='Arial, sans-serif' font-size='32' font-weight='bold' fill='%231e40af' text-anchor='middle' opacity='0.4'%3EKarnataka%3C/text%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Map background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5" />
          
          {/* Grid pattern overlay for map-like appearance */}
          <div className="absolute inset-0 opacity-15" style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }} />
          
          {/* Entity markers with blinking animation - no onClick */}
          <div className="absolute inset-0 p-6">
            {mapLocations.slice(0, 20).map((location, index) => {
              const Icon = getIcon(location.type);
              // Distribute entities across the map more evenly
              const top = 10 + (index * 18) % 70;
              const left = 10 + (index * 25) % 75;
              
              return (
                <div
                  key={location.id}
                  className="absolute group z-10"
                  style={{ top: `${top}%`, left: `${left}%` }}
                >
                  <div className="relative">
                    {/* Blinking pulse animation */}
                    <div className={`absolute inset-0 ${getStatusColor(location.status)} rounded-full animate-ping opacity-75`} style={{ animationDuration: '2s' }} />
                    
                    {/* Main icon */}
                    <div className={`relative p-2 rounded-full ${getStatusColor(location.status)} shadow-lg transition-all hover:scale-125 hover:shadow-xl`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                      <div className="bg-card border border-border rounded-lg p-3 shadow-xl min-w-[200px]">
                        <h4 className="font-semibold text-sm mb-1">{location.name}</h4>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <Badge variant="outline" className="capitalize">
                            {location.type}
                          </Badge>
                          <Badge className={getStatusColor(location.status)}>
                            {location.status}
                          </Badge>
                        </div>
                        {location.patients !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            {location.patients} patients
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
          <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg p-3 shadow-lg z-10">
            <h4 className="text-xs font-semibold mb-2">Entity Types</h4>
            <div className="space-y-1">
              {[
                { icon: Hospital, label: "Hospitals", count: entityCounts.hospital },
                { icon: Building2, label: "Clinics", count: entityCounts.clinic },
                { icon: Pill, label: "Pharmacies", count: entityCounts.pharmacy },
                { icon: FlaskConical, label: "Labs", count: entityCounts.lab },
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
