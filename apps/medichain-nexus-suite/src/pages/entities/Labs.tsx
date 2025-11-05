import { FlaskConical, MapPin, TestTube, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@admin/components/ui/card";
import { Badge } from "@admin/components/ui/badge";
import { Button } from "@admin/components/ui/button";
import { Input } from "@admin/components/ui/input";

const mockLabs = [
  { id: 1, name: "PathLabs", location: "Delhi", tests: 234, pending: 45, status: "active" },
  { id: 2, name: "Dr. Lal PathLabs", location: "Mumbai", tests: 312, pending: 67, status: "active" },
  { id: 3, name: "Thyrocare", location: "Chennai", tests: 189, pending: 23, status: "active" },
];

const Labs = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Laboratories</h1>
          <p className="text-muted-foreground">Monitor lab operations and test results</p>
        </div>
        <Button className="bg-gradient-primary">
          <FlaskConical className="mr-2 h-4 w-4" />
          Add Laboratory
        </Button>
      </div>

      <div className="flex gap-4">
        <Input placeholder="Search laboratories..." className="max-w-md" />
        <Button variant="outline">Filters</Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-success mb-2">43</p>
              <p className="text-sm text-muted-foreground">Total Labs</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-success mb-2">42</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">1,850</p>
              <p className="text-sm text-muted-foreground">Tests Today</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {mockLabs.map((lab) => (
          <Card key={lab.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-success/10">
                    <FlaskConical className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{lab.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {lab.location}
                    </CardDescription>
                  </div>
                </div>
                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                  {lab.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted rounded-lg">
                  <TestTube className="h-4 w-4 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">{lab.tests}</p>
                  <p className="text-xs text-muted-foreground">Tests Today</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Clock className="h-4 w-4 mx-auto mb-1 text-warning" />
                  <p className="text-lg font-bold">{lab.pending}</p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="text-center p-3 bg-muted rounded-lg">
                  <Button variant="ghost" size="sm" className="text-xs">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Labs;
