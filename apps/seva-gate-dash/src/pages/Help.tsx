import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, Phone, Mail, MessageCircle } from "lucide-react";

const Help = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Help & Support</h2>
        <p className="text-muted-foreground">Get assistance and find answers to common questions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Phone className="mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 font-semibold text-foreground">Phone Support</h3>
            <p className="mb-4 text-sm text-muted-foreground">Call our helpdesk for immediate assistance</p>
            <Button variant="outline" size="sm">
              1800-XXX-XXXX
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <Mail className="mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 font-semibold text-foreground">Email Support</h3>
            <p className="mb-4 text-sm text-muted-foreground">Send us your queries via email</p>
            <Button variant="outline" size="sm">
              support@hospital.gov
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <MessageCircle className="mb-4 h-12 w-12 text-primary" />
            <h3 className="mb-2 font-semibold text-foreground">Live Chat</h3>
            <p className="mb-4 text-sm text-muted-foreground">Chat with support team in real-time</p>
            <Button variant="outline" size="sm">
              Start Chat
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-center">
            <HelpCircle className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">FAQ section coming soon</p>
            <p className="text-sm text-muted-foreground">Find answers to common questions</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Help;
