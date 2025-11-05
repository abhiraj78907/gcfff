import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, Check, AlarmClock } from "lucide-react";
import { useMemo } from "react";
import { useSubEntry } from "@/contexts/SubEntryContext";
import { mockAdherenceEvents } from "@/lib/mocks/adherence";
import { filterBySubEntry } from "@/lib/api-utils";

export default function Reminders() {
  const { currentSubEntry } = useSubEntry();
  const events = useMemo(() => currentSubEntry ? filterBySubEntry(mockAdherenceEvents, currentSubEntry.id) : [], [currentSubEntry]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Medicine Reminders</h1>
        <p className="text-muted-foreground">Confirm your doses or snooze reminders</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((ev) => (
          <Card key={ev.id} className="hover:shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Reminder #{ev.id}
                <Badge className="ml-auto" variant={ev.status === "scheduled" ? "secondary" : ev.status === "confirmed" ? "default" : "outline"}>
                  {ev.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm">Channel: {ev.channel.toUpperCase()}</p>
              <p className="text-xs text-muted-foreground">Scheduled: {new Date(ev.scheduledAt).toLocaleString()}</p>
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="default"><Check className="h-4 w-4 mr-1" /> Took Dose</Button>
                <Button size="sm" variant="outline"><AlarmClock className="h-4 w-4 mr-1" /> Snooze</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


