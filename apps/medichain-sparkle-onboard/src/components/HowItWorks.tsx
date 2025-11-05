import { Building2, FileUp, Stethoscope } from "lucide-react";

const steps = [
  {
    icon: Building2,
    title: "Register Your Institution",
    description: "Quick and simple onboarding process to get your facility connected to Medichain."
  },
  {
    icon: FileUp,
    title: "Upload Templates",
    description: "Customize prescription templates and configure your workflows to match your needs."
  },
  {
    icon: Stethoscope,
    title: "Start AI-Backed Operations",
    description: "Begin consultations with AI assistance and streamline your entire healthcare delivery."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-secondary/10 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-primary/10 rounded-full blur-[100px]"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block px-4 py-2 mb-6 rounded-full bg-accent/10 border border-accent/20">
            <span className="text-sm font-semibold text-accent">SIMPLE PROCESS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight">
            Get Started in Three
            <span className="block text-muted-foreground mt-2">Simple Steps</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your healthcare operations in minutes, not months.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Animated connecting lines - hidden on mobile */}
            <div className="hidden md:block absolute top-28 left-[16%] right-[16%] h-0.5">
              <div className="h-full bg-gradient-to-r from-primary via-accent to-secondary relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent animate-slide-in"></div>
              </div>
            </div>
            
            {steps.map((step, index) => (
              <div 
                key={index}
                className="relative animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="text-center">
                  {/* Icon with number badge */}
                  <div className="relative inline-block mb-8">
                    <div className="w-24 h-24 lg:w-28 lg:h-28 rounded-2xl glass-card flex items-center justify-center shadow-glow hover:scale-110 transition-all duration-500 relative z-10 group">
                      <step.icon className="w-12 h-12 lg:w-14 lg:h-14 text-primary group-hover:text-accent transition-colors duration-300" />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>
                    <div className="absolute -top-3 -right-3 w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 text-background flex items-center justify-center font-bold text-lg shadow-card border-2 border-background">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-4 px-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed text-base lg:text-lg max-w-sm mx-auto">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
