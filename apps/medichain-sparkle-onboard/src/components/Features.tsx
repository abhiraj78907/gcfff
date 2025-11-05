import { Bot, PackageSearch, LayoutDashboard } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "AI-Powered Doctor Assistance",
    description: "Voice-assisted consultations with automated prescription generation. Let AI handle the paperwork while you focus on patient care.",
    gradient: "from-primary/20 to-accent/20"
  },
  {
    icon: PackageSearch,
    title: "Integrated Pharmacy & Lab",
    description: "Seamless stock management, test tracking, and patient medication adherence monitoring in one unified system.",
    gradient: "from-accent/20 to-secondary/20"
  },
  {
    icon: LayoutDashboard,
    title: "Multi-Client Control",
    description: "Centralized admin dashboard with real-time performance insights across all your facilities and departments.",
    gradient: "from-secondary/20 to-primary/20"
  }
];

const Features = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
      {/* Background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-primary/10 rounded-full blur-[150px]"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-20 animate-fade-in-up">
          <div className="inline-block px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/20">
            <span className="text-sm font-semibold text-primary">POWERFUL FEATURES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6 leading-tight">
            Transform Your Healthcare
            <span className="block text-muted-foreground mt-2">Operations Today</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need to run a cutting-edge, efficient healthcare facility with modern technology.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group glass-card p-8 lg:p-10 hover:shadow-hover transition-all duration-500 hover:-translate-y-3 rounded-2xl cursor-pointer animate-fade-in-up border-primary/5 hover:border-primary/20"
              style={{ animationDelay: `${index * 150}ms` }}
              role="article"
              aria-label={feature.title}
            >
              <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-500 shadow-card group-hover:shadow-glow relative`}>
                <feature.icon className="w-8 h-8 lg:w-10 lg:h-10 text-primary" />
                <div className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed text-base lg:text-lg">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
