import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Mail, Phone, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const EntitySuccess = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-success/5 via-background to-primary/5 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 md:p-12">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Registration Successful!</h1>
          <p className="text-muted-foreground text-lg">
            Your institution has been registered with MediChain
          </p>
        </div>

        <div className="bg-accent/50 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Building2 className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Entity ID: MDCH-2025-{Math.floor(Math.random() * 100000)}</p>
              <p className="text-sm text-muted-foreground">Save this ID for future reference</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-lg">Next Steps:</h3>
          <div className="space-y-3">
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">1</span>
              </div>
              <div>
                <p className="font-medium">Verification in Progress</p>
                <p className="text-sm text-muted-foreground">Our team will verify your registration within 24-48 hours</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">2</span>
              </div>
              <div>
                <p className="font-medium">Check Your Email</p>
                <p className="text-sm text-muted-foreground">You'll receive login credentials and setup instructions</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-semibold text-primary">3</span>
              </div>
              <div>
                <p className="font-medium">Register Users</p>
                <p className="text-sm text-muted-foreground">Add doctors, receptionists, and staff members to your institution</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 space-y-4">
          <p className="text-sm text-muted-foreground text-center">Need help or have questions?</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              support@medichain.com
            </Button>
            <Button variant="outline" className="gap-2">
              <Phone className="w-4 h-4" />
              +91 1800-123-4567
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/onboard/register-user" className="flex-1">
              <Button className="w-full">Register Users Now</Button>
            </Link>
            <Link to="/onboard/login" className="flex-1">
              <Button variant="outline" className="w-full">Go to Login</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link to="/receptionist" className="flex-1">
              <Button variant="outline" className="w-full">Receptionist Dashboard</Button>
            </Link>
            <Link to="/admin" className="flex-1">
              <Button variant="outline" className="w-full">Admin Dashboard</Button>
            </Link>
          </div>
          <Link to="/" className="flex-1">
            <Button variant="ghost" className="w-full">Back to Home</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default EntitySuccess;
