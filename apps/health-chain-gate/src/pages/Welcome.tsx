import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Hospital, Moon, Pill, Stethoscope, ShieldCheck, Sun, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/use-theme";

const Welcome = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 relative">
      {/* Theme Toggle - Fixed Top Right */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleTheme();
        }}
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
          border: `3px solid ${theme === "dark" ? "#475569" : "#94a3b8"}`,
          boxShadow: theme === "dark" 
            ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)" 
            : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          zIndex: 99999,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
        aria-label="Toggle theme"
        type="button"
        title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      >
        {theme === "dark" ? (
          <Sun style={{ width: "28px", height: "28px", color: "#fbbf24" }} />
        ) : (
          <Moon style={{ width: "28px", height: "28px", color: "#1e293b" }} />
        )}
      </button>

      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">MediChain</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register-entity">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            AI-Powered Healthcare Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Transform Healthcare Management with AI
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Streamline operations, reduce patient wait times, and enhance care quality with MediChain's comprehensive platform for hospitals, clinics, and pharmacies.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link to="/register-entity">
              <Button size="lg" className="gap-2">
                <Hospital className="w-5 h-5" />
                Register Your Institution
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Hospital className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">For Hospitals</h3>
            <p className="text-muted-foreground">
              Comprehensive patient management, AI-assisted consultations, and streamlined workflows for government and private hospitals.
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">For Clinics</h3>
            <p className="text-muted-foreground">
              Quick patient registration, digital prescriptions, and efficient appointment scheduling for smaller practices.
            </p>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-info/10 rounded-lg flex items-center justify-center mb-4">
              <Pill className="w-6 h-6 text-info" />
            </div>
            <h3 className="text-xl font-semibold mb-2">For Pharmacies</h3>
            <p className="text-muted-foreground">
              Digital prescription management, inventory tracking, and seamless integration with healthcare providers.
            </p>
          </Card>
        </div>

        {/* Key Benefits */}
        <div className="bg-card rounded-xl p-8 border">
          <div className="flex items-center gap-2 mb-6">
            <ShieldCheck className="w-6 h-6 text-success" />
            <h3 className="text-2xl font-bold">Why Choose MediChain?</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
              </div>
              <div>
                <h4 className="font-semibold mb-1">AI-Assisted Workflows</h4>
                <p className="text-sm text-muted-foreground">Gemini AI transcribes consultations and structures patient data automatically</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Multi-Language Support</h4>
                <p className="text-sm text-muted-foreground">Works in Hindi, Kannada, Tamil, and English for inclusive care</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Digital Prescriptions</h4>
                <p className="text-sm text-muted-foreground">Reduce errors with standardized, readable digital prescriptions</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <div className="w-2 h-2 bg-success rounded-full"></div>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Secure & Compliant</h4>
                <p className="text-sm text-muted-foreground">HIPAA-compliant data protection and secure patient records</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
