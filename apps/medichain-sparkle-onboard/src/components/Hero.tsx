import { Button } from "@welcome/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Activity } from "lucide-react";
import heroImage from "@welcome/assets/hero-medical.jpg";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-background pt-16 pb-16 sm:pt-20 sm:pb-20">
      {/* Animated gradient orbs */}
      <div className="absolute top-10 left-4 w-40 h-40 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-primary/20 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] animate-float"></div>
      <div className="absolute bottom-10 right-4 w-40 h-40 sm:w-72 sm:h-72 lg:w-96 lg:h-96 bg-secondary/15 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] animate-float" style={{ animationDelay: '1s' }}></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000,transparent)]"></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid gap-8 sm:gap-12 lg:grid-cols-2 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full glass border border-primary/20">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground">India's Most Advanced Healthcare Platform</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-[1.15] sm:leading-[1.1]">
              Empowering Indian
              <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-fade-in">
                Healthcare Innovation
              </span>
            </h1>
            
            <p className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Unified, AI-driven platform connecting hospitals, clinics, and pharmacies. 
              <span className="text-foreground font-medium"> Trusted by thousands of healthcare professionals.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-10 sm:mb-12">
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gradient-to-r from-primary to-accent hover:shadow-glow group font-semibold text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7 rounded-xl transition-all duration-300 hover:scale-105"
                aria-label="Register your healthcare facility"
                onClick={() => navigate('/onboard/register')}
              >
                Register Your Institution
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto border-2 border-border hover:border-primary/50 bg-card/50 hover:bg-card backdrop-blur-sm font-semibold text-base sm:text-lg px-6 sm:px-8 py-6 sm:py-7 rounded-xl transition-all duration-300 hover:scale-105"
                aria-label="Learn more about our services"
                onClick={() => navigate('/onboard/login')}
              >
                Login
              </Button>
            </div>
            
            {/* Trust indicators with counter animation feel */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-xl mx-auto lg:mx-0 glass-card rounded-2xl p-4 sm:p-6">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">100+</div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground font-medium">Hospitals Connected</div>
              </div>
              <div className="text-center lg:text-left border-l border-r border-border/50 px-2">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">5,000+</div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground font-medium">Active Doctors</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-1">1M+</div>
                <div className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground font-medium">Prescriptions</div>
              </div>
            </div>
          </div>
          
          {/* Right image with glass effect */}
          <div className="hidden lg:block animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-3xl blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
              <div className="relative glass-card rounded-3xl p-2 hover:scale-[1.02] transition-transform duration-500">
                <img 
                  src={heroImage} 
                  alt="Modern healthcare technology platform showing AI-powered medical systems" 
                  className="relative rounded-2xl shadow-glow w-full h-auto"
                  loading="eager"
                />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -bottom-4 -left-4 glass-card rounded-2xl p-4 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-background" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">AI-Powered</div>
                    <div className="text-xs text-muted-foreground">Next-gen care</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
