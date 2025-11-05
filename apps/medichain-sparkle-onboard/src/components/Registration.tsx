import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";

const benefits = [
  "AI-powered consultation assistance",
  "Integrated pharmacy and lab management",
  "Real-time analytics dashboard",
  "24/7 technical support"
];

const Registration = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10"></div>
      
      {/* Animated orbs */}
      <div className="absolute top-6 left-4 w-40 h-40 sm:w-72 sm:h-72 bg-primary/20 rounded-full blur-[80px] sm:blur-[120px] animate-float"></div>
      <div className="absolute bottom-6 right-4 w-40 h-40 sm:w-72 sm:h-72 bg-secondary/20 rounded-full blur-[80px] sm:blur-[120px] animate-float" style={{ animationDelay: '1.5s' }}></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:64px_64px] opacity-30"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-5xl mx-auto text-center animate-fade-in-up">
          <div className="inline-block px-4 py-2 mb-8 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-semibold text-primary">GET STARTED TODAY</span>
          </div>
          
          <h2 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight">
            Join Medichain and Transform
            <span className="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mt-2">
              Your Healthcare Facility
            </span>
          </h2>
          
          <p className="text-base sm:text-xl text-muted-foreground mb-8 sm:mb-12 max-w-3xl mx-auto leading-relaxed">
            Experience India's most advanced digital healthcare platform. No credit card required.
          </p>
          
          {/* Benefits grid */}
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-10 sm:mb-12 max-w-3xl mx-auto">
            {benefits.map((benefit, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 text-left glass-card p-5 lg:p-6 rounded-xl animate-slide-in hover:scale-105 transition-all duration-300 group border-primary/5 hover:border-primary/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex-shrink-0 w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-card group-hover:shadow-glow transition-all duration-300">
                  <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-background" />
                </div>
                <span className="font-semibold text-foreground text-base lg:text-lg">{benefit}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent hover:shadow-glow group font-semibold text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-7 rounded-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto min-h-[44px] whitespace-normal break-words text-left"
              aria-label="Start your free trial"
              onClick={() => navigate('/onboard/register')}
            >
              Get Started Now
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-border hover:border-primary/50 bg-card/50 hover:bg-card backdrop-blur-sm font-semibold text-base sm:text-lg px-6 sm:px-10 py-4 sm:py-7 rounded-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto min-h-[44px] whitespace-normal break-words text-left"
              aria-label="Contact our support team"
            >
              Contact Support
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Free 30-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-primary" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Registration;
