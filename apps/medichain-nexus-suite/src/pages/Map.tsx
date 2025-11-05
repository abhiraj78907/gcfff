import { EntityMap } from "@admin/components/dashboard/EntityMap";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { MapPin, Filter } from "lucide-react";
import { Button } from "@admin/components/ui/button";

const Map = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Geographic Map</h1>
          <p className="text-muted-foreground">Real-time location tracking of all healthcare entities</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          Filter Entities
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {[
          { label: "Total Entities", value: "312", color: "primary" },
          { label: "Active Now", value: "304", color: "success" },
          { label: "Maintenance", value: "5", color: "warning" },
          { label: "Critical", value: "3", color: "destructive" },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <EntityMap />
    </div>
  );
};

export default Map;
