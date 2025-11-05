import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Stethoscope, Eye, EyeOff, AlertCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "../../../../src/contexts/AuthContext";
import { useSubEntry } from "../../../../src/contexts/SubEntryContext";
import type { UserRole } from "../../../../src/types/entities";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { demoUsersByEntity, authenticateDemo } from "../../../../src/lib/mocks/demoUsers";
import DemoLogin from "../components/DemoLogin";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, activeRole } = useAuth();
  const { currentEntityId, currentSubEntryId, setEntity, setSubEntry } = useSubEntry();
  const [chosenRole, setChosenRole] = useState<UserRole | undefined>(undefined);
  const [institutionId, setInstitutionId] = useState<string>(currentEntityId ?? "");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showCreds, setShowCreds] = useState<boolean>(false);

  const roleToDefaultPath: Record<UserRole, string> = {
    admin: "/dashboard/admin",
    receptionist: "/receptionist",
    doctor: "/doctor",
    "lab-tech": "/lab",
    pharmacist: "/pharmacy",
    patient: "/patient",
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Validate required fields
    if (!institutionId || !username || !password || !chosenRole) {
      setIsLoading(false);
      toast({ title: "Missing details", description: "Institution, username, password, and role are required.", variant: "destructive" });
      return;
    }
    // Authenticate against demo users
    const match = authenticateDemo({ entityId: institutionId, username, password, role: chosenRole });
    if (!match) {
      setIsLoading(false);
      toast({ title: "Invalid credentials", description: "Please check institution, username, password, and role.", variant: "destructive" });
      return;
    }
    const roles: UserRole[] = [match.role];
    const entityId = match.entityId;
    const subEntryId = match.subEntryId;
    login({ roles, entityId, subEntryId, primaryRole: roles[0] });
    if (entityId) setEntity(entityId);
    if (subEntryId) setSubEntry(subEntryId);

    toast({
      title: "Login Successful",
      description: `Welcome ${match.name} (${match.role}) @ ${entityId}`,
    });
    const from = (location.state as any)?.from as string | undefined;
    const defaultPath = roleToDefaultPath[roles[0]];
    const isFromAllowed = from ? from.startsWith(defaultPath) : false;
    navigate(isFromAllowed ? from! : defaultPath, { replace: true });
  };

  const handlePasswordReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    toast({
      title: "Reset Link Sent",
      description: "Check your email for password reset instructions",
    });
    setShowForgotPassword(false);
    setResetEmail("");
  };

  const entityName: Record<string, string> = {
    "entity-apo": "Apollo Hospital",
    "entity-grn": "GreenLife Clinic",
    "entity-med": "MediTown Pharmacy",
  };
  const demoInstitutions = Object.keys(demoUsersByEntity).map((id) => ({ id, name: entityName[id] ?? id }));
  const onDemoClick = (entityId: string, role: UserRole) => {
    const pool = demoUsersByEntity[entityId] || [];
    const user = pool.find((u) => u.role === role);
    if (!user) return;
    setInstitutionId(entityId);
    setChosenRole(role);
    setUsername(user.username);
    setPassword(user.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold">MediChain</h1>
          </Link>
          <p className="text-muted-foreground text-center">Sign in to access your healthcare dashboard</p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            <DemoLogin
              onAutofill={({ entityId, role, username: u, password: p }) => {
                setInstitutionId(entityId);
                setChosenRole(role);
                setUsername(u);
                setPassword(p);
              }}
            />

            <div className="space-y-2">
              <Label htmlFor="institution">Institution ID</Label>
              <Input id="institution" placeholder="e.g., entity-apo" value={institutionId} onChange={(e) => setInstitutionId(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={chosenRole} onValueChange={(v) => setChosenRole(v as UserRole)}>
                <SelectTrigger aria-label="Select role for this session">
                  <SelectValue placeholder="Auto-detect or choose role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="receptionist">Receptionist</SelectItem>
                  <SelectItem value="lab-tech">Lab Technician</SelectItem>
                  <SelectItem value="pharmacist">Pharmacist</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email or Username</Label>
              <Input
                id="email"
                type="text"
                placeholder="you@example.com"
                required
                autoComplete="email"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                  Remember me
                </Label>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/register-entity" className="text-primary hover:underline font-medium">
                Register Institution
              </Link>
            </p>
          </div>

          {/* Info Note */}
          <div className="mt-6 flex items-start gap-2 p-3 bg-info/10 rounded-lg border border-info/20">
            <AlertCircle className="w-4 h-4 text-info mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              If you're a new user, please contact your institution administrator to create an account for you.
            </p>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Forgot Password Dialog */}
      <Dialog open={showForgotPassword} onOpenChange={setShowForgotPassword}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Enter your email address and we'll send you a link to reset your password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePasswordReset} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reset-email">Email Address</Label>
              <Input
                id="reset-email"
                type="email"
                placeholder="you@example.com"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" className="flex-1">
                Send Reset Link
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowForgotPassword(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
